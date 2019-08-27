import React from "react";
import styles from "./Double.module.css";
import FocusManager from "../../FocusManager";
import Single from "../Single/Single";
class Double extends React.Component {
  static defaultProps = {};
  focusManager = undefined;
  constructor(props) {
    super(props);
    this.focusManager = new FocusManager(this, "double");
  }
  render() {
    return (
      <div className={styles.root}>
        <Single />
        <Single />
      </div>
    );
  }
}
export default Double;
