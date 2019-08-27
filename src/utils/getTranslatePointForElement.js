export default function getTranslatePointForElement(elem) {
  const transArr = [];
  if (!elem || elem === window) return null;
  if (!window.getComputedStyle) return null;

  const style = getComputedStyle(elem);
  const transform =
    style.transform || style.webkitTransform || style.mozTransform;
  let mat = transform.match(/^matrix3d\((.+)\)$/);
  if (mat) return parseFloat(mat[1].split(', ')[13]);
  mat = transform.match(/^matrix\((.+)\)$/);
  if (mat) {
    transArr.push(parseFloat(mat[1].split(', ')[4]));
    transArr.push(parseFloat(mat[1].split(', ')[5]));
  }

  // NOT TRANSLATED
  if (!transArr || transArr.length < 1) return { x: 0, y: 0 };

  const transPoint = { x: transArr[0], y: transArr[1] };
  return transPoint;
}
