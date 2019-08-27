import isUsingTranslateScroll from './isUsingTranslateScroll';
import getScrollLikePointForElement from './getScrollLikePointForElement';

export default function getScrollToPointFromDelta({
  element,
  x = 0,
  y = 0,
  useTranslate = isUsingTranslateScroll(),
}) {
  const elemScrollPoint = getScrollLikePointForElement(element, useTranslate);
  if (!elemScrollPoint) return null;
  const toPoint = {
    x: x + elemScrollPoint.x,
    y: y + elemScrollPoint.y,
  };

  if (
    toPoint.x === undefined ||
    toPoint.y === undefined ||
    isNaN(toPoint.x) ||
    isNaN(toPoint.y)
  ) {
    return null;
  }

  return toPoint;
}
