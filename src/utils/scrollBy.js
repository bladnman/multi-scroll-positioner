import Scroller from './Scroller';
import isUsingTranslateScroll from './isUsingTranslateScroll';
import getScrollToPointFromDelta from './getScrollToPointFromDelta';

export default function scrollBy({
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

  const toPoint = getScrollToPointFromDelta({ x, y, element, useTranslate });

  return new Scroller({
    element,
    toPoint,
    onDone,
    durationMs,
    fps,
    easeFn,
    onCancel,
    useTranslate,
    id,
  });
}
