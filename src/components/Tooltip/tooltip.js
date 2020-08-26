/**
 * This file is an extend from react-native-walkthrough-tooltip
 *
 * We change the onClose props callback and destructuring property
 *
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Dimensions, InteractionManager, Modal, TouchableWithoutFeedback, View } from "react-native";
import rfcIsEqual from "react-fast-compare";
import {
  computeBottomGeometry,
  computeCenterGeomerty,
  computeLeftGeometry,
  computeRightGeometry,
  computeTopGeometry,
  makeChildlessRect,
  Point,
  Rect,
  Size,
  swapSizeDimmensions
} from "./geom";
import styleGenerator from "./styles";
import TooltipChildrenContext from "./tooltip-children.context";

export { TooltipChildrenContext };

const DEFAULT_DISPLAY_INSETS = {
  top: 24,
  bottom: 24,
  left: 24,
  right: 24,
};

const computeDisplayInsets = (insetsFromProps) => Object.assign({}, DEFAULT_DISPLAY_INSETS, insetsFromProps);

const invertPlacement = (placement) => {
  switch (placement) {
    case 'top':
      return 'bottom';
    case 'bottom':
      return 'top';
    case 'right':
      return 'left';
    case 'left':
      return 'right';
    default:
      return placement;
  }
};

class Tooltip extends Component {
  static defaultProps = {
    allowChildInteraction: true,
    arrowSize: new Size(16, 8),
    // eslint-disable-next-line react/default-props-match-prop-types
    backgroundColor: 'rgba(0,0,0,0.5)',
    childContentSpacing: 4,
    children: null,
    closeOnChildInteraction: true,
    content: <View />,
    displayInsets: {},
    isVisible: false,
    onClose: () => {
      console.warn('[react-native-walkthrough-tooltip] onClose prop no provided');
    },
    placement: 'center', // falls back to "top" if there ARE children
    showChildInTooltip: true,
    supportedOrientations: ['portrait', 'landscape'],
    useInteractionManager: false,
    useReactNativeModal: true,
  };

  static propTypes = {
    allowChildInteraction: PropTypes.bool,
    arrowSize: PropTypes.shape({
      height: PropTypes.number,
      width: PropTypes.number,
    }),
    childContentSpacing: PropTypes.number,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    closeOnChildInteraction: PropTypes.bool,
    content: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    displayInsets: PropTypes.shape({
      top: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number,
    }),
    isVisible: PropTypes.bool,
    onClose: PropTypes.func,
    placement: PropTypes.oneOf(['top', 'left', 'bottom', 'right', 'center']),
    showChildInTooltip: PropTypes.bool,
    supportedOrientations: PropTypes.arrayOf(PropTypes.string),
    useInteractionManager: PropTypes.bool,
    useReactNativeModal: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    const { isVisible, useInteractionManager } = props;

    this.isMeasuringChild = false;

    this.childWrapper = React.createRef();
    this.state = {
      // no need to wait for interactions if not visible initially
      waitingForInteractions: isVisible && useInteractionManager,
      contentSize: new Size(0, 0),
      adjustedContentSize: new Size(0, 0),
      anchorPoint: new Point(0, 0),
      tooltipOrigin: new Point(0, 0),
      childRect: new Rect(0, 0, 0, 0),
      displayInsets: computeDisplayInsets(props.displayInsets),
      // if we have no children, and place the tooltip at the "top" we want it to
      // behave like placement "bottom", i.e. display below the top of the screen
      placement: React.Children.count(props.children) === 0 ? invertPlacement(props.placement) : props.placement,
      readyToComputeGeom: false,
      waitingToComputeGeom: false,
      measurementsFinished: false,
      windowDims: Dimensions.get('window'),
    };
  }

  componentDidMount() {
    const { state } = this;
    if (state.waitingForInteractions) {
      this.measureChildRect();
    }

    Dimensions.addEventListener('change', this.updateWindowDims);
  }

  componentDidUpdate(prevProps, prevState) {
    const { content, isVisible, placement } = this.props;
    const { displayInsets } = this.state;

    const contentChanged = !rfcIsEqual(prevProps.content, content);
    const placementChanged = prevProps.placement !== placement;
    const becameVisible = isVisible && !prevProps.isVisible;
    const insetsChanged = !rfcIsEqual(prevState.displayInsets, displayInsets);

    if (contentChanged || placementChanged || becameVisible || insetsChanged) {
      setTimeout(() => {
        this.measureChildRect();
      });
    }
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.updateWindowDims);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const nextState = {};

    // update placement in state if the prop changed
    const nextPlacement = React.Children.count(nextProps.children) === 0 ? invertPlacement(nextProps.placement) : nextProps.placement;

    if (nextPlacement !== prevState.placement) {
      nextState.placement = nextPlacement;
    }

    // update computed display insets if they changed
    const nextDisplayInsets = computeDisplayInsets(nextProps.displayInsets);
    if (!rfcIsEqual(nextDisplayInsets, prevState.displayInsets)) {
      nextState.displayInsets = nextDisplayInsets;
    }

    // set measurements finished flag to false when tooltip closes
    if (prevState.measurementsFinished && !nextProps.isVisible) {
      nextState.measurementsFinished = false;
    }

    if (Object.keys(nextState).length) {
      return nextState;
    }

    return null;
  }

  updateWindowDims = (dims) => {
    this.setState(
      {
        windowDims: dims.window,
        contentSize: new Size(0, 0),
        adjustedContentSize: new Size(0, 0),
        anchorPoint: new Point(0, 0),
        tooltipOrigin: new Point(0, 0),
        childRect: new Rect(0, 0, 0, 0),
        readyToComputeGeom: false,
        waitingToComputeGeom: false,
        measurementsFinished: false,
      },
      () => {
        setTimeout(() => {
          this.measureChildRect();
        }, 500); // give the rotation a moment to finish
      }
    );
  };

  doChildlessPlacement = () => {
    const { windowDims, placement, displayInsets } = this.state;
    this.onMeasurementComplete(
      makeChildlessRect({
        displayInsets,
        placement, // MUST use from state, not props
        windowDims,
      })
    );
  };

  measureContent = (e) => {
    const { width, height } = e.nativeEvent.layout;
    const contentSize = new Size(width, height);
    const { readyToComputeGeom } = this.state;
    if (!readyToComputeGeom) {
      this.setState({
        waitingToComputeGeom: true,
        contentSize,
      });
    } else {
      this._doComputeGeometry({ contentSize });
    }

    const { children } = this.props;
    if (React.Children.count(children) === 0) {
      this.doChildlessPlacement();
    }
  };

  onMeasurementComplete = (rect) => {
    this.setState(
      {
        childRect: rect,
        readyToComputeGeom: true,
        waitingForInteractions: false,
      },
      () => {
        this.isMeasuringChild = false;
        this._updateGeometry();
      }
    );
  };

  measureChildRect = () => {
    const doMeasurement = () => {
      if (!this.isMeasuringChild) {
        this.isMeasuringChild = true;
        if (this.childWrapper.current && typeof this.childWrapper.current.measure === 'function') {
          this.childWrapper.current.measure((x, y, width, height, pageX, pageY) => {
            const childRect = new Rect(pageX, pageY, width, height);
            this.onMeasurementComplete(childRect);
          });
        } else {
          this.doChildlessPlacement();
        }
      }
    };

    const { useInteractionManager } = this.props;
    if (useInteractionManager) {
      InteractionManager.runAfterInteractions(() => {
        doMeasurement();
      });
    } else {
      doMeasurement();
    }
  };

  _doComputeGeometry = ({ contentSize }) => {
    const geom = this.computeGeometry({ contentSize });
    const { tooltipOrigin, anchorPoint, placement } = geom;
    this.setState({
      contentSize,
      tooltipOrigin,
      anchorPoint,
      placement,
      readyToComputeGeom: undefined,
      waitingToComputeGeom: false,
      measurementsFinished: true,
    });
  };

  _updateGeometry = () => {
    const { contentSize } = this.state;
    const geom = this.computeGeometry({ contentSize });
    const { tooltipOrigin, anchorPoint, placement, adjustedContentSize } = geom;

    this.setState({
      tooltipOrigin,
      anchorPoint,
      placement,
      measurementsFinished: true,
      adjustedContentSize,
    });
  };

  computeGeometry = ({ contentSize, placement }) => {
    const { placement: placement1 } = this.state;
    const innerPlacement = placement || placement1;
    const { arrowSize, childContentSpacing, children } = this.props;
    const { childRect, displayInsets, windowDims } = this.state;

    const options = {
      displayInsets,
      childRect,
      windowDims,
      arrowSize: innerPlacement === 'top' || innerPlacement === 'bottom' ? arrowSize : swapSizeDimmensions(arrowSize),
      contentSize,
      childContentSpacing,
    };

    // special case for centered, childless placement tooltip
    if (innerPlacement === 'center' && React.Children.count(children) === 0) {
      return computeCenterGeomerty(options);
    }

    switch (innerPlacement) {
      case 'bottom':
        return computeBottomGeometry(options);
      case 'left':
        return computeLeftGeometry(options);
      case 'right':
        return computeRightGeometry(options);
      case 'top':
      default:
        return computeTopGeometry(options);
    }
  };

  renderChildInTooltip = () => {
    const { childRect } = this.state;
    const { height, width, x, y } = childRect;
    const { onClose, closeOnChildInteraction, allowChildInteraction, children } = this.props;

    const onTouchEnd = () => {
      if (closeOnChildInteraction) {
        onClose();
      }
    };

    return (
      <TooltipChildrenContext.Provider value={{ tooltipDuplicate: true }}>
        <View
          onStartShouldSetResponder={() => true}
          onTouchEnd={onTouchEnd}
          pointerEvents={allowChildInteraction ? 'box-none' : 'none'}
          style={{
            position: 'absolute',
            height,
            width,
            top: y,
            left: x,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {children}
        </View>
      </TooltipChildrenContext.Provider>
    );
  };

  renderContentForTooltip = () => {
    const { measurementsFinished, displayInsets, placement, adjustedContentSize, anchorPoint, tooltipOrigin } = this.state;
    const { props } = this;
    const generatedStyles = styleGenerator({
      adjustedContentSize,
      anchorPoint,
      arrowSize: props.arrowSize,
      displayInsets,
      measurementsFinished,
      ownProps: { ...props },
      placement,
      tooltipOrigin,
    });

    const hasChildren = React.Children.count(props.children) > 0;

    return (
      <TouchableWithoutFeedback onPress={(e) => props.onClose(e, this.state)}>
        <View style={generatedStyles.containerStyle}>
          <View style={[generatedStyles.backgroundStyle]}>
            <View style={generatedStyles.tooltipStyle}>
              {hasChildren ? <View style={generatedStyles.arrowStyle} /> : null}
              <View onLayout={this.measureContent} style={generatedStyles.contentStyle}>
                {props.content}
              </View>
            </View>
          </View>
          {hasChildren && props.showChildInTooltip ? this.renderChildInTooltip() : null}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    const { children, isVisible, useReactNativeModal, onClose, supportedOrientations } = this.props;
    const { waitingForInteractions } = this.state;

    const hasChildren = React.Children.count(children) > 0;
    const showTooltip = isVisible && !waitingForInteractions;

    return (
      <React.Fragment>
        {useReactNativeModal ? (
          <Modal animationType="fade" transparent visible={showTooltip} onRequestClose={(e) => onClose(e, this.state)} supportedOrientations={supportedOrientations}>
            {this.renderContentForTooltip()}
          </Modal>
        ) : null}

        {/* This renders the child element in place in the parent's layout */}
        {hasChildren ? (
          <View ref={this.childWrapper} onLayout={this.measureChildRect}>
            {children}
          </View>
        ) : null}

        {!useReactNativeModal && showTooltip ? this.renderContentForTooltip() : null}
      </React.Fragment>
    );
  }
}

export default Tooltip;
