import findAncestorScrollFM from "./findAncestorScrollFM";
import scrollBy from "../utils/scrollBy";
import getPositionRule from "./getPositionRule";

export default function positionFM({
  nodeFM,
  scrollFM,
  durationMs = 500,
  stepDurationPercFloatAdjustmentMs = 0,
  vNodeRect = {}
}) {
  if (!nodeFM) {
    console.warn("no nodeFM to position");
    return;
  }

  scrollFM = scrollFM || findAncestorScrollFM(nodeFM);
  // still no scroller, our work is done
  if (!scrollFM) return;

  console.groupCollapsed(`${nodeFM.id}`);

  const positionRule = getPositionRule({ nodeFM, vNodeRect });

  // NO RULE
  if (!positionRule || !positionRule.yDelta) {
    console.log("No positioning needed");
  }

  // RULE
  else {
    console.log(positionRule.fpY, `fm fpY definition`);
    console.log(positionRule.yDelta, `final Δ`);
    // MOVE THINGS
    scrollBy({
      element: scrollFM.panelElem,
      y: positionRule.yDelta,
      durationMs: Math.max(0, durationMs)
    });

    // NOW, WALK UP
    // we take this scrollFM and position him. Remember that we always need
    // to keep track of the original _node_ (vNodeRect) which inFrame rules use
    positionFM({
      nodeFM: scrollFM,
      durationMs: durationMs + durationMs * stepDurationPercFloatAdjustmentMs,
      vNodeRect
    });
  }
  console.groupEnd(`${nodeFM.id}`);
}
