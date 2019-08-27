import ReactDOM from "react-dom";

export default function getFMElement(fm) {
  if (!fm || !fm.component) return null;

  // we will memo this... it's expensive
  if (fm.__fmElem) return fm.__fmElem;

  fm.__fmElem = ReactDOM.findDOMNode(fm.component);
  return fm.__fmElem;
}
