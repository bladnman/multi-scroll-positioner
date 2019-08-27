import React from "react";
import cx from "classnames";
import styles from "./Single.module.css";
import FMDiv from "../../FMDiv/FMDiv";
import ScrollDiv from "../../ScrollDiv/ScrollDiv";
import Toolbar from "../../Toolbar/Toolbar";
import FocusManager from "../../FocusManager";
import positionFM from "../../tools/positionFM";
class Single extends React.Component {
  static defaultProps = {};
  focusManager = undefined;
  items = [
    {
      fpY: "75%",
      classes: [styles.small, styles.bgLight]
    },
    {
      fpY: "20%",
      classes: [styles.medium, styles.bgDark]
    },
    {
      fpY: "0%",
      classes: [styles.medium, styles.bgLight]
    },
    {
      fpY: "95%",
      classes: [styles.large, styles.bgMedium]
    },
    {
      fpY: "50%",
      classes: [styles.small, styles.bgDark]
    },
    {
      fpY: "TOP",
      classes: [styles.small, styles.bgDark]
    },
    {
      fpY: "-10%",
      classes: [styles.medium, styles.bgLight]
    },
    {
      fpY: "MIDDLE",
      classes: [styles.small, styles.bgMedium]
    },
    {
      fpY: "10",
      classes: [styles.small, styles.bgLight]
    },
    {
      fpY: "300",
      classes: [styles.small, styles.bgDark]
    },
    {
      fpY: "800px",
      classes: [styles.small, styles.bgLight]
    },
    {
      fpY: "bottom",
      classes: [styles.medium, styles.bgDark]
    },
    {
      fpY: null,
      classes: [styles.small, styles.bgMedium]
    },
    {
      fpY: undefined,
      classes: [styles.small, styles.bgLight]
    },
    {
      classes: [styles.small, styles.bgDark]
    }
  ];
  constructor(props) {
    super(props);
    this.focusManager = new FocusManager(this, "baseLayout");
  }
  handleClick = id => {
    positionFM({ nodeFM: this.getFM(id) });
  };
  getItemId(idx) {
    return `item_${idx + 1}`;
  }
  getFM(id) {
    const { focusManager } = this;
    const scrollDivFM = focusManager.focusManagers[0];
    return scrollDivFM.focusManagers.find(fm => fm.id === id);
  }

  /** RENDERERS */
  render() {
    const { focusManager, items, getItemId } = this;
    const { className } = this.props;
    return (
      <div className={styles.root}>
        <ScrollDiv
          className={cx(styles.scrollDiv, className)}
          parentFocusManager={focusManager}
        >
          {items.map((def, idx) => (
            <FMDiv
              key={idx}
              fmId={getItemId(idx)}
              fpY={def.fpY}
              onPress={this.handleClick}
              className={cx(styles.item, def.classes)}
            />
          ))}
        </ScrollDiv>
        {this.renderToolbar()}
      </div>
    );
  }
  renderToolbar() {
    const { items } = this;
    return (
      <Toolbar className={styles.toolbar}>
        {items.map((def, idx) => (
          <button
            key={idx}
            className={cx(styles.button)}
            onClick={() => this.handleClick(this.getItemId(idx))}
          >
            {this.getItemId(idx)} - {def.fpY}
          </button>
        ))}
      </Toolbar>
    );
  }
}
export default Single;
