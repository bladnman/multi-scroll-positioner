import getScrollPointForElement from './getScrollPointForElement';
import getTranslatePointForElement from './getTranslatePointForElement';
import invertSign from './invertSign';

/**
 * Will return a point representing the offset of the element as if
 * it was a scroll-offset.
 *
 * The distinction here is when `translate` is being used we will
 * get the _translatePoint_ and invert the values; translation and
 * scroll use opposite mechanisms to describe the offset. This
 * function flattens that difference into a `scroll-like` response.
 * @param {Object} DOMElement
 * @param {boolean} useTranslate
 * @return {Object} {x,y};
 */
export default function getScrollLikePointForElement(
  element,
  useTranslate = false
) {
  if (!element) return null;

  // SCROLL VALUES
  if (!useTranslate) return getScrollPointForElement(element);

  /**
   * For translate the values are flipped, so to make
   * these number look like a scroll we `* -1` them
   */
  const transPoint = getTranslatePointForElement(element);
  if (transPoint) {
    transPoint.x = invertSign(transPoint.x);
    transPoint.y = invertSign(transPoint.y);
  }
  return transPoint;
}
