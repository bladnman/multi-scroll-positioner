export default function isAScrollFM(fm) {
  if ( !fm ) return false;
  return fm.panelElem && fm.frameElem;
}