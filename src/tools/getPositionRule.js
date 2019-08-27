import findAncestorScrollFM from "./findAncestorScrollFM";
import getFMElement from "./getFMElement";
import getViewportRect from "./getViewportRect";
import moveRectBy from "./moveRectBy";
import merge from "../utils/merge";
/**
 * This will return an *fpY* position rule using _the most specific_
 * rule. This means the closest *fpY* rule to the node being positioned.
 *
 * @param {focusManager} nodeFM
 * @param {focusManager} scrollFM
 * @param {rect} scrollFrameRect
 * @returns (positionRuleStruct | null)
 */
export default function getPositionRule({
  nodeFM,
  scrollFM,
  scrollFrameRect,
  vNodeRect
}) {
  // no more parents - no rules
  if (!nodeFM) return null;

  // we need a scrollFM to position with
  if (!scrollFM) {
    scrollFM = findAncestorScrollFM(nodeFM);
    // still no scroller .. can't do anything
    if (!scrollFM) return null;
  }

  if (!scrollFrameRect) {
    scrollFrameRect = getViewportRect(scrollFM.frameElem);
    // no can do without a frameRect
    if (!scrollFrameRect) return null;
  }

  // made it up to scrollFM - no rules
  if (nodeFM === scrollFM) return null;

  // CREATE NEW VIRTUAL NODE RECT
  // this is updated with all moves, and used in all
  // inFrame rule applications
  if (!vNodeRect || vNodeRect.x === undefined || vNodeRect.x === null) {
    vNodeRect = merge(vNodeRect, getViewportRect(getFMElement(nodeFM)));
    console.log(vNodeRect.y, `vNodeRect.y : orig`);
  }

  const positionRule = getRelativePositionRule(
    nodeFM,
    scrollFrameRect,
    vNodeRect
  );

  // DONE - we found our rule
  if (positionRule) {
    return positionRule;
  }

  // NOT FOUND - keep walking up our heritage to look for rules
  return getPositionRule({
    nodeFM: nodeFM.parentFocusManager,
    scrollFM,
    scrollFrameRect,
    vNodeRect
  });
}

function getRelativePositionRule(nodeFM, containerRect, vNodeRect) {
  // NO NODE - nothing to do - bail
  if (!nodeFM) return null;

  const rule = {
    yDelta: 0,
    fpY: undefined,
    elem: undefined,
    rect: undefined,
    fm: nodeFM,
    containerRect
  };

  rule.elem = getFMElement(rule.fm);
  rule.rect = getViewportRect(rule.elem);
  rule.fpY = rule.fm.fpY;

  const hasRects = rule.rect && rule.containerRect;
  const hasRule = rule.fpY !== undefined && rule.fpY !== null;

  if (hasRects && hasRule) {
    // apply FPY rules
    adjustPositionRule_fpY(rule, vNodeRect);
    console.log(rule.yDelta, `Δ after fpY`);
  }

  // apply IN-FRAME rules
  adjustPositionRuleRect_inFrame(rule, vNodeRect);
  console.log(rule.yDelta, `Δ after inFrame`);

  // NO CHANGE NEEDED - bail
  if (rule.yDelta === 0) return null;

  return rule;
}

/** HELPERS */
function integerizeRect(rect) {
  if (!rect) return;
  const keys = ["x", "y", "left", "top", "height", "width", "right", "bottom"];
  keys.forEach(key => {
    if (key in rect) rect[key] = ~~rect[key];
  });
}
/** FPY RULE */
function adjustPositionRule_fpY(rule, vNodeRect) {
  const { fpY, rect, containerRect } = rule;
  if (fpY === null || fpY === undefined) return;
  if (!rect || !containerRect) return;

  let cleanedFpy = rule.fpY && rule.fpY.toUpperCase();

  // CLEAN UP cleanedFpy
  if (cleanedFpy === "TOP" || !cleanedFpy) {
    cleanedFpy = "0%";
  } else if (cleanedFpy === "MIDDLE" || cleanedFpy === "CENTER") {
    cleanedFpy = "50%";
  } else if (cleanedFpy === "BOTTOM") {
    cleanedFpy = "100%";
  }

  const fpYInt = isNaN(parseInt(cleanedFpy, 10)) ? 0 : parseInt(cleanedFpy, 10);
  const percFloat = fpYInt / 100;

  const isPercentageRule = cleanedFpy.indexOf("%") > -1; // ex. 25%
  const isPixelRule = cleanedFpy.indexOf("PX") > -1 || fpYInt === ~~cleanedFpy; // ex. 300px or 300

  let newNodeViewportY = undefined;

  // % - PERCENTAGE
  if (isPercentageRule) {
    newNodeViewportY = containerRect.y + containerRect.height * percFloat;

    // 50% rule - use center of nodeFM rather than top for positioning
    if (fpYInt === 50) {
      newNodeViewportY -= ~~(rect.height / 2);
    }
  }

  // px - PIXEL RULE
  else if (isPixelRule) {
    newNodeViewportY = containerRect.y + fpYInt;
  }

  rule.yDelta = ~~(rect.y + newNodeViewportY * -1);

  moveRectBy(vNodeRect, { y: rule.yDelta * -1 }); // -1 for translate move, I believe. likely switched for scrolling
  console.log(vNodeRect.y, `vNodeRect.y : after fpY`);

  // we only want integers in our values
  integerizeRect(vNodeRect);
}
/** IN-FRAME RULE */
function adjustPositionRuleRect_inFrame(rule, vNodeRect) {
  const { containerRect } = rule;
  if (!vNodeRect || !containerRect) return;

  const isNodeTallerThanContainer = vNodeRect.height > containerRect.height;
  const isNodeFullyInFrame =
    vNodeRect.top >= containerRect.top &&
    vNodeRect.bottom <= containerRect.bottom;
  const isNodeOffFrameAbove = vNodeRect.top < containerRect.top;
  const isNodeOffFrameBelow = vNodeRect.bottom > containerRect.bottom;

  if (isNodeFullyInFrame) return;

  let yDeltaAdjustment = undefined;

  // TALLER; OFF-TOP; OFF-BOTTOM
  // <- nodeTop : frameTop
  if (isNodeTallerThanContainer && isNodeOffFrameAbove && isNodeOffFrameBelow) {
    yDeltaAdjustment = containerRect.top - vNodeRect.top;
  }

  // OFF-TOP
  else if (isNodeOffFrameAbove) {
    // TALLER
    // <- nodeBottom : frameBottom
    if (isNodeTallerThanContainer) {
      yDeltaAdjustment = containerRect.bottom - vNodeRect.bottom;
    }
    // SHORTER
    // <- nodeTop : frameTop
    else {
      yDeltaAdjustment = containerRect.top - vNodeRect.top;
    }
  }

  // OFF-BOTTOM
  else if (isNodeOffFrameBelow) {
    // TALLER
    // <- nodeTop : frameTop
    if (isNodeTallerThanContainer) {
      yDeltaAdjustment = containerRect.top - vNodeRect.top;
    }
    // SHORTER
    // <- nodeBottom : frameBottom
    else {
      yDeltaAdjustment = containerRect.bottom - vNodeRect.bottom;
    }
  }

  // CHANGES NEEDED - update things
  if (yDeltaAdjustment !== undefined) {
    yDeltaAdjustment = ~~yDeltaAdjustment;
    moveRectBy(vNodeRect, { y: yDeltaAdjustment }); // -1  likely switched for scrolling
    integerizeRect(vNodeRect);

    console.log(yDeltaAdjustment, `yDeltaAdjustment : due to inFrame`);
    console.log(vNodeRect.y, `vNodeRect.y : after inFrame`);

    // update rule's yDelta
    rule.yDelta -= yDeltaAdjustment;
  }

  // ALREADY IN FRAME
  else {
    console.log(`no adjustment for inFrame needed`);
  }
}
