import isAScrollFM from "./isAScrollFM";

export default function findAncestorScrollFM(fm) {
  if (!fm || !fm.parentFocusManager) return null;

  // is a scroll fm
  if (isAScrollFM(fm.parentFocusManager)) {
    return fm.parentFocusManager;
  }

  return findAncestorScrollFM(fm.parentFocusManager);
}
