import getRect from "./getRect";

export default function getViewportRect(elem) {
  if (!elem) return null;
  return getRect(elem.getBoundingClientRect());
}
