export default class FocusManager {
  constructor(component, id, fpY) {
    this.id = id;
    this.component = component;
    this.parentFocusManager = component.props.parentFocusManager;
    this.focusedChild = undefined;
    this.fpY = fpY;
    this.focusManagers = [];
    this.frameElem = undefined;
    this.panelElem = undefined;
  }
  add(fm) {
    this.focusManagers.push(fm);
    fm.parentFocusManager = this;
  }
}
