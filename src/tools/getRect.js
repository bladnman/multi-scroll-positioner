export default function getRect({ x = 0, y = 0, width = 0, height = 0 }) {
  return {
    x,
    y,
    width,
    height,
    left: x,
    top: y,
    right: x + width,
    bottom: y + height,
  };
}
