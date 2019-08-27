import React from "react";
import cx from "classnames";
import styles from "./FMDiv.module.css";
import FocusManager from "../FocusManager";
class FMDiv extends React.Component {
  static defaultProps = {
    fmId: "n/a",
    fpY: undefined,
    parentFocusManager: undefined,
    onPress: undefined
  };
  focusManager = undefined;
  constructor(props) {
    super(props);
    this.focusManager = new FocusManager(this);
    this.focusManager.id = props.fmId;
    this.focusManager.fpY = props.fpY;

    if (props.parentFocusManager) {
      props.parentFocusManager.add(this.focusManager);
    }
  }
  handlePress = () => {
    const { id } = this.focusManager;
    const { onPress } = this.props;
    if (onPress) {
      onPress(id);
    }
  };
  render() {
    const { focusManager, handlePress } = this;
    const { className, style } = this.props;
    return (
      <div
        className={cx(styles.root, className)}
        style={style}
        onClick={handlePress}
      >
        <div className={cx(styles.label, styles.id)}>
          {focusManager && focusManager.id}{" "}
        </div>
        <div className={cx(styles.label, styles.fpY)}>
          {" "}
          ({focusManager && focusManager.fpY}){" "}
        </div>
      </div>
    );
  }
}
export default FMDiv;
