import React, { PureComponent } from "react";
import {
  Animated,
  requireNativeComponent,
  NativeModules,
  findNodeHandle
} from "react-native";
import PropTypes from "prop-types";
import MagicMoveCloneContext from "./CloneContext";

class MagicMoveNativeClone extends PureComponent {
  static propTypes = {
    component: PropTypes.any.isRequired,
    parentRef: PropTypes.any.isRequired,
    containerLayout: PropTypes.any.isRequired, // TODO?
    isScene: PropTypes.bool.isRequired,
    isTarget: PropTypes.bool.isRequired,
    isInitial: PropTypes.bool,
    contentOffsetX: PropTypes.number,
    contentOffsetY: PropTypes.number,
    contentWidth: PropTypes.number,
    contentHeight: PropTypes.number,
    snapshotType: PropTypes.number,
    children: PropTypes.any,
    style: PropTypes.any,
    blurRadius: PropTypes.number,
    onLayout: PropTypes.func,
    onShow: PropTypes.func,
    debug: PropTypes.bool
  };

  static defaultProps = {
    debug: false,
    isInitial: false,
    contentOffsetX: 0,
    contentOffsetY: 0,
    contentWidth: 0,
    contentHeight: 0,
    blurRadius: 0
  };

  static Context = MagicMoveCloneContext;

  static isAvailable = NativeModules.MagicMoveCloneManager ? true : false;

  constructor(props) {
    super(props);
    if (!MagicMoveNativeClone.isAvailable) {
      throw new Error(
        "MagicMoveNativeClone is not available, did you forget to use `react-native link react-native-magic-move`?"
      );
    }
    this.state = {
      style: undefined
    };
  }

  render() {
    const {
      component,
      style,
      children,
      isInitial,
      isScene,
      isTarget,
      contentOffsetX,
      contentOffsetY,
      contentWidth,
      contentHeight,
      blurRadius
    } = this.props;
    return (
      <AnimatedRCTMagicMoveClone
        ref={isInitial ? this._setRef : undefined}
        id={isScene ? component.getId() : component.props.id}
        isScene={isScene}
        isTarget={isTarget}
        style={style || this.state.style}
        contentOffsetX={contentOffsetX}
        contentOffsetY={contentOffsetY}
        contentWidth={contentWidth}
        contentHeight={contentHeight}
        blurRadius={blurRadius}
      >
        {isScene ? children : undefined}
      </AnimatedRCTMagicMoveClone>
    );
  }

  _setRef = ref => {
    this._ref = ref;
    this._init();
  };

  async _init() {
    if (!this._ref) return;
    const {
      isScene,
      isTarget,
      debug,
      component,
      parentRef,
      snapshotType
    } = this.props;
    // console.log("INIT #1: ", component.getRef(), parentRef, isScene, isTarget);
    const source = findNodeHandle(component.getRef());
    const parent = findNodeHandle(parentRef);
    const layout = await NativeModules.MagicMoveCloneManager.init(
      {
        id: isScene ? component.getId() : component.props.id,
        source,
        parent,
        isScene,
        isTarget,
        debug,
        snapshotType
      },
      findNodeHandle(this._ref)
    );
    if (layout.width * layout.height) {
      if (this.props.onLayout) {
        this.props.onLayout(layout);
      }
      if (this.props.onShow) {
        this.props.onShow(layout);
      }
      this.setState({
        style: {
          position: "absolute",
          width: layout.width,
          height: layout.height,
          left: 0,
          top: 0,
          transform: [{ translateX: layout.x }, { translateY: layout.y }]
        }
      });
    }
  }
}

const RCTMagicMoveClone = MagicMoveNativeClone.isAvailable
  ? requireNativeComponent("RCTMagicMoveClone", MagicMoveNativeClone)
  : undefined;

const AnimatedRCTMagicMoveClone = MagicMoveNativeClone.isAvailable
  ? Animated.createAnimatedComponent(RCTMagicMoveClone)
  : undefined;

export default MagicMoveNativeClone;