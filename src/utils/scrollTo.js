import Scroller from './Scroller';
import getFirstNotUndefined from './getFirstNotUndefined';
import getScrollLikePointForElement from './getScrollLikePointForElement';
import isUsingTranslateScroll from './isUsingTranslateScroll';

export default function scrollTo({
  element,
  x,
  y,
  durationMs = 200,
  fps = 60,
  easeFn = Scroller.EASE.easeOutCuaic,
  onDone,
  onCancel,
  useTranslate = isUsingTranslateScroll(),
  id,
}) {
  if (!element) {
    console.warn('You must provied an element to scroll');
    return;
  }

  const elemScrollPoint = getScrollLikePointForElement(element, useTranslate);
  const toPoint = {
    x: getFirstNotUndefined(x, elemScrollPoint.x),
    y: getFirstNotUndefined(y, elemScrollPoint.y),
  };

  if (toPoint.x === undefined && toPoint.y === undefined) {
    console.warn('You must provied a new position to scroll to');
    return;
  }
  return new Scroller({
    element,
    toPoint,
    durationMs,
    fps,
    easeFn,
    onDone,
    onCancel,
    id,
  });
}