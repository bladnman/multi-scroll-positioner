import React from 'react';
import cx from 'classnames';
import styles from './DynaSingle.module.css';
import ScrollDiv from '../../ScrollDiv/ScrollDiv';
import FMDiv from '../../FMDiv/FMDiv';
import positionFM from '../../tools/positionFM';
import FocusManager from '../../FocusManager';
class DynaSingle extends React.Component {
  static defaultProps = {
    count: 11,
    focusedIndex: undefined,
    percentPerItem: 10,
    startPercentInt: 0,
    durationMs: 2500,
    stepDurationPercFloatAdjustmentMs: 2.0,
  };
  focusManager = undefined;
  _items = [];
  constructor(props) {
    super(props);
    this.focusManager = new FocusManager(this, 'dynSingle');
  }
  componentDidUpdate(prevProps) {
    if (prevProps.focusedIndex !== this.props.focusedIndex) {
      this.positionOnFM(this.getFM(this.getItemId(this.props.focusedIndex)));
    }
  }
  handleClick = id => {
    this.positionOnFM(this.getFM(id));
  };
  positionOnFM(nodeFM) {
    const { durationMs, stepDurationPercFloatAdjustmentMs } = this.props;
    positionFM({ nodeFM, durationMs, stepDurationPercFloatAdjustmentMs });
  }
  getFM(id) {
    const { focusManager } = this;
    const scrollDivFM = focusManager.focusManagers[0];
    return scrollDivFM.focusManagers.find(fm => fm.id === id);
  }
  getItemId(idx) {
    return `item_${idx + 1}`;
  }
  get items() {
    const { count, percentPerItem, startPercentInt } = this.props;
    const { getItemId } = this;
    if (this._items.length === count) return this._items;

    this._items = [];
    for (let idx = 0; idx < count; idx++) {
      let sizeClass = styles.small;
      if (idx % 2 === 0) sizeClass = styles.medium;
      if (idx % 5 === 0) sizeClass = styles.large;
      if (idx % 6 === 0) sizeClass = styles.huge;
      if (idx % 7 === 0) sizeClass = styles.extreme;
      this._items.push({
        fpY: `${idx * percentPerItem + startPercentInt}%`,
        fmId: getItemId(idx),
        classes: [
          styles.item,
          sizeClass,
          idx % 2 === 0 ? styles.bgLight : styles.bgDark,
        ],
      });
    }

    return this._items;
  }
  render() {
    const { focusManager, items } = this;
    const { className, frameClass, panelClass } = this.props;
    return (
      <div className={cx(styles.root, className)}>
        <ScrollDiv
          className={cx(styles.scrollDiv)}
          frameClass={cx(frameClass)}
          panelClass={cx(panelClass)}
          parentFocusManager={focusManager}
        >
          {items.map((def, idx) => (
            <FMDiv
              key={idx}
              fmId={def.fmId}
              fpY={def.fpY}
              onPress={this.handleClick}
              className={cx(styles.item, def.classes)}
            />
          ))}
        </ScrollDiv>
      </div>
    );
  }
}
export default DynaSingle;
