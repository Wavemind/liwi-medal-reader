// @flow
import * as React from 'react';
import { ScrollView } from 'react-native';
import { Button, Icon, Text, View } from 'native-base';
import { styles } from './ConfirmationView.styles';
import Tooltip from '../Tooltip/tooltip';

export default class ConfirmationView extends React.Component<Props, State> {
  state = {
    toolTipVisible: false,
  };

  static defaultProps = {
    propsToolTipVisible: false,
  };

  // Lifecycle for optimization
  shouldComponentUpdate(nextProps, nextState) {
    const { toolTipVisible } = this.state;
    const { propsToolTipVisible } = this.props;

    return nextState.toolTipVisible !== toolTipVisible || propsToolTipVisible !== nextProps.propsToolTipVisible;
  }

  _renderToolTipContent = () => {
    const {
      nextRoute,
      idPatient,
      app: { t },
      navigation,
      callBackClose,
      medicalCase,
    } = this.props;

    return (
      <View>
        <ScrollView>
          <View onStartShouldSetResponder={() => true}>
            <Text style={styles.pad}>{t('confirm:message')}</Text>
            <View flex-container-column>
              <View w50>
                <Button
                  w50
                  iconLeft
                  onPress={() => {
                    if (medicalCase.isCreating) {
                      navigation.navigate(nextRoute, {
                        idPatient: idPatient,
                        newMedicalCase: false,
                      });
                    }

                    this.setState({ toolTipVisible: false });
                    callBackClose();
                  }}
                  style={styles.buttonPrev}
                >
                  <Text>{t('continue')}</Text>
                  <Icon name="edit" type="AntDesign" style={styles.icon} />
                </Button>
                <Button
                  w50
                  success
                  onPress={() => {
                    this.setState({ toolTipVisible: false });
                    callBackClose();
                    navigation.navigate(nextRoute, {
                      idPatient: idPatient,
                      newMedicalCase: true,
                    });
                  }}
                  style={styles.buttonNext}
                >
                  <Text>{t('new')}</Text>
                  <Icon name="arrowright" type="AntDesign" style={styles.icon} />
                </Button>
              </View>
            </View>
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
    const { callBackClose } = this.props;
    let xTouch = reactNative.nativeEvent.pageX;
    let xTooltip = toolTip.tooltipOrigin.x;
    let xEndToolTip = toolTip.tooltipOrigin.x + toolTip.contentSize.width;

    let yTouch = reactNative.nativeEvent.pageY;
    let yTooltip = toolTip.tooltipOrigin.y;
    let yEndToolTip = toolTip.tooltipOrigin.y + toolTip.contentSize.height;

    let insideContent = xTouch > xTooltip && xTouch < xEndToolTip && (yTouch > yTooltip && yTouch < yEndToolTip);

    if (!insideContent) {
      this.setState({ toolTipVisible: false });
      callBackClose();
    }
  };

  componentWillReceiveProps(nextProps: Props): * {
    if (nextProps.propsToolTipVisible === true) {
      this.setState({ toolTipVisible: true });
    }
  }

  render() {
    const { toolTipVisible } = this.state;
    const { flex } = this.props;

    return (
      <View flex={flex}>
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
