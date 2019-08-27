export default function moveRectBy(rect, { x = 0, y = 0 }) {
  if (!rect) return rect;
  // need both x and y
  if (!("x" in rect) || !("y" in rect)) return rect;

  rect.x += x;
  rect.y += y;

  if ("left" in rect) rect.left += x;
  if ("top" in rect) rect.top += y;
  if ("right" in rect) rect.right += x;
  if ("bottom" in rect) rect.bottom += y;

  return rect;
}
