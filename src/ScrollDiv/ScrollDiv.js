import React from "react";
import cx from "classnames";
import styles from "./ScrollDiv.module.css";
import FocusManager from "../FocusManager";
class ScrollDiv extends React.Component {
  static defaultProps = {
    fmId: "scrollDiv"
  };
  focusManager = undefined;
  frameElem = undefined;
  panelElem = undefined;
  constructor(props) {
    super(props);
    this.focusManager = new FocusManager(this);
    this.focusManager.id = props.fmId;
    this.focusManager.fpY = props.fpY;

    if (props.parentFocusManager) {
      props.parentFocusManager.add(this.focusManager);
    }
  }
  saveFrameRef = ref => {
    this.frameElem = ref;
    this.focusManager.frameElem = this.frameElem;
  };
  savePanelRef = ref => {
    this.panelElem = ref;
    this.focusManager.panelElem = this.panelElem;
  };
  render() {
    const { className, children, frameClass, panelClass } = this.props;
    const { focusManager, saveFrameRef, savePanelRef } = this;
    return (
      <div
        className={cx(styles.root, styles.frame, className, frameClass)}
        ref={saveFrameRef}
      >
        <div className={cx(styles.panel, panelClass)} ref={savePanelRef}>
          {React.Children.map(children, child =>
            React.cloneElement(child, {
              parentFocusManager: focusManager
            })
          )}
        </div>
      </div>
    );
  }
  renderHOLD() {
    const { className } = this.props;
    return (
      <div className={cx(styles.root, styles.frame, className)}>
        <div className={cx(styles.panel)}>{this.props.children}</div>
      </div>
    );
  }
}
export default ScrollDiv;
