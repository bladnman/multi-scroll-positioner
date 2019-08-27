import React from "react";
import cx from "classnames";
import styles from "./Nested.module.css";
import ScrollDiv from "../../ScrollDiv/ScrollDiv";
import DynaSingle from "../DynaSingle/DynaSingle";
import ReactDOM from "react-dom";
import Toolbar from "../../Toolbar/Toolbar";
import scrollTo from "../../utils/scrollTo";

class Nested extends React.Component {
  static defaultProps = {
    itemCount: 15,
    percentPerItem: 10,
    startPercentInt: -30
  };
  outerScrollComp = undefined;
  outerScrollElem = undefined;
  innerScrollComp = undefined;
  innerScrollElem = undefined;
  _itemButtonsList = [];
  state = {
    focusedIndex: undefined
  };
  saveOuterScrollRef = ref => {
    this.outerScrollComp = ref;
    this.outerScrollElem = ReactDOM.findDOMNode(this.outerScrollComp);
  };
  saveInnerScrollRef = ref => {
    this.innerScrollComp = ref;
    this.innerScrollElem = ReactDOM.findDOMNode(this.innerScrollComp);
  };
  handleClick = idx => {
    this.setState({
      focusedIndex: idx
    });
  };
  handleResetClick = () => {
    scrollTo({ element: this.outerScrollComp.panelElem, y: 0 });
  };
  handleTestClick = () => {
    scrollTo({ element: this.outerScrollComp.panelElem, y: 100 });
  };
  get itemButtonsList() {
    const { itemCount } = this.props;
    if (this._itemButtonsList.length === itemCount)
      return this._itemButtonsList;

    this._itemButtonsList = [];
    for (let idx = 0; idx < itemCount; idx++) {
      this._itemButtonsList.push({ idx });
    }

    return this._itemButtonsList;
  }
  render() {
    const {
      className,
      itemCount,
      percentPerItem,
      startPercentInt
    } = this.props;
    const { saveOuterScrollRef } = this;
    const { focusedIndex } = this.state;
    return (
      <div className={cx(styles.root, className)}>
        <ScrollDiv ref={saveOuterScrollRef}>
          <DynaSingle
            count={itemCount}
            percentPerItem={percentPerItem}
            className={styles.scroller}
            frameClass={cx(styles.frame)}
            panelClass={cx(styles.panel)}
            focusedIndex={focusedIndex}
            startPercentInt={startPercentInt}
          />
        </ScrollDiv>
        {this.renderToolbar()}
      </div>
    );
  }
  renderToolbar() {
    const { itemButtonsList } = this;
    return (
      <Toolbar className={styles.toolbar}>
        {/* RESET SCROLL */}

        <button
          key={"reset"}
          className={cx(styles.button, styles.resetButton)}
          onClick={() => this.handleResetClick()}
        >
          RESET SCROLL
        </button>

        <button
          key={"test"}
          className={cx(styles.button, styles.resetButton)}
          onClick={() => this.handleTestClick()}
        >
          test
        </button>

        {/* ITEM BUTTONS */}
        {itemButtonsList.map((def, idx) => (
          <button
            key={def.idx}
            className={cx(styles.button)}
            onClick={() => this.handleClick(def.idx)}
          >
            Item {def.idx + 1}
          </button>
        ))}
      </Toolbar>
    );
  }
}
export default Nested;
