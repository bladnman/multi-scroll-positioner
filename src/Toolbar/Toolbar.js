import React from "react";
import cx from "classnames";
import styles from "./Toolbar.module.css";
class Toolbar extends React.Component {
  static defaultProps = {};
  render() {
    const { className } = this.props;
    return (
      <div className={cx(styles.root, className)}>{this.props.children}</div>
    );
  }
}
export default Toolbar;
