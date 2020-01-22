import * as React from 'react';

import { ScrollView, View } from 'react-native';
import { Button, Icon, Text } from 'native-base';
import { styles } from './ToolTipModal.style';
import Tooltip from '../Tooltip/tooltip';

export default class TooltipButton extends React.Component<Props, State> {
  state = {
    toolTipVisible: false,
  };

  // Lifecycle for optimization
  shouldComponentUpdate(nextProps, nextState) {
    const { toolTipVisible } = this.state;
    return nextState.toolTipVisible !== toolTipVisible;
  }

  _renderToolTipContent = () => {
    return (
      <View>
        <ScrollView>
          <View onStartShouldSetResponder={() => true}>
            <Button onPress={() => this.setState({ toolTipVisible: false })} rounded style={styles.button}>
              <Icon name="close" type="AntDesign" style={styles.icon} />
            </Button>
            {this.props.children}
          </View>
        </ScrollView>
      </View>
    );
  };

  /**
   * Close the tooltip when the click is outside the tooltip
   *
   * Callback receive from the tooltip component when it ask for close itself
   *
   * @param reactNative : reactNative.nativeEvent is the data from react native who
   *                      has all info about the screen size (in point) gives the position of the click
   * @param toolTip : data from the tooltip like origin on screen and size gives the position of the tooltip
   */
  onCloseToolTip = (reactNative, toolTip) => {
    let xTouch = reactNative.nativeEvent.pageX;
    let xTooltip = toolTip.tooltipOrigin.x;
    let xEndToolTip = toolTip.tooltipOrigin.x + toolTip.contentSize.width;

    let yTouch = reactNative.nativeEvent.pageY;
    let yTooltip = toolTip.tooltipOrigin.y;
    let yEndToolTip = toolTip.tooltipOrigin.y + toolTip.contentSize.height;

    let insideContent = xTouch > xTooltip && xTouch < xEndToolTip && (yTouch > yTooltip && yTouch < yEndToolTip);

    if (!insideContent) {
      this.setState({ toolTipVisible: false });
    }
  };

  render() {
    const { toolTipVisible } = this.state;
    const { flex } = this.props;

    return (
      <View flex={flex}>
        <Button style={styles.touchable} transparent onPress={() => this.setState({ toolTipVisible: true })}>
          <Icon type="AntDesign" name="info" style={styles.iconInfo} />
        </Button>
        <Tooltip
          isVisible={toolTipVisible}
          closeOnChildInteraction={false}
          showChildInTooltip={false}
          content={this._renderToolTipContent()}
          placement="center"
          onClose={this.onCloseToolTip}
        />
      </View>
    );
  }
}
