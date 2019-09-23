// @flow
import * as React from 'react';
import type { NavigationScreenProps } from 'react-navigation';
import { ScrollView, View } from 'react-native';
import { Button, Icon, ListItem, Text } from 'native-base';
import {
  displayFormats,
  nodesType,
  priorities,
  valueFormats,
} from '../../../../frontend_service/constants';
import { liwiColors } from '../../../utils/constants';
import { styles } from './Question.factory.style';
import Boolean from '../DisplaysContainer/Boolean';
import Numeric from '../DisplaysContainer/Numeric';
import { ViewQuestion } from '../../../template/layout';
import List from '../DisplaysContainer/List';
import Tooltip from '../../Tooltip/tooltip';

type Props = NavigationScreenProps & {};

type State = {};

function LabelQuestion(props: {
  label: String,
  flex: String,
  marginRight: Numeric,
  marginLeft: Numeric,
}) {
  const { label, flex, marginRight, marginLeft } = props;
  return (
    <ViewQuestion flex={flex} marginRight={marginRight} marginLeft={marginLeft}>
      <Text style={{ color: liwiColors.blackColor }} size-auto>
        {label}
      </Text>
    </ViewQuestion>
  );
}

class WrapperQuestion extends React.Component<Props, State> {
  state = {
    toolTipVisible: false,
  };

  // Lifecycle for optimization
  shouldComponentUpdate(nextProps, nextState) {
    const { question } = this.props;
    const { toolTipVisible } = this.state;
    return (
      nextProps.question.answer !== question.answer ||
      nextProps.question.value !== question.value ||
      nextState.toolTipVisible !== toolTipVisible
    );
  }

  _renderToolTipContent = () => {
    const { question } = this.props;
    return (
      <View>
        <ScrollView>
          <View onStartShouldSetResponder={() => true}>
            <Button
              onPress={() => this.setState({ toolTipVisible: false })}
              rounded
              style={styles.button}
            >
              <Icon name="close" type="AntDesign" style={styles.icon} />
            </Button>
            <Text subTitle>{question.label}</Text>
            <Text>Description: {question.description}</Text>
            <Text>Id: {question.id}</Text>
            <Text>Reference : {question.reference}</Text>
          </View>
        </ScrollView>
      </View>
    );
  };

  /**
   * Close the tooltip the click is outside the tooltip
   *
   * Callback receive from the tooltip component when it ask for close itself
   *
   * We calculate the click on the screen with position native and from tooltip and close it if the click is outside the tooltip.
   *
   * @param reactNative : reactNative.nativeEvent is the data from react native who has all info about the screen size (in point)
   * @param toolTip : data from the tooltip like origin on screen and size
   *
   * merging this infos we can calculate exactly where is the tooltip and the click from the user
   */
  onCloseToolTip = (reactNative, toolTip) => {
    let xTouch = reactNative.nativeEvent.pageX;
    let xTooltip = toolTip.tooltipOrigin.x;
    let xEndToolTip = toolTip.tooltipOrigin.x + toolTip.contentSize.width;

    let yTouch = reactNative.nativeEvent.pageY;
    let yTooltip = toolTip.tooltipOrigin.y;
    let yEndToolTip = toolTip.tooltipOrigin.y + toolTip.contentSize.height;

    let insideContent =
      xTouch > xTooltip &&
      xTouch < xEndToolTip &&
      (yTouch > yTooltip && yTouch < yEndToolTip);

    if (!insideContent) {
      this.setState({ toolTipVisible: false });
    }
  };

  render() {
    const { question, specificStyle } = this.props;
    const { toolTipVisible } = this.state;
    // By default no component
    let WrapperAnswer = () => null;

    // Depending the format of the question we call the right component
    // Boolean | Numeric | List
    switch (question.display_format) {
      case displayFormats.radioButton:
        if (question.value_format === valueFormats.bool) {
          WrapperAnswer = () => (
            <Boolean
              question={question}
              styles={specificStyle}
              {...this.props}
            />
          );
        }
        break;
      case displayFormats.input:
        WrapperAnswer = () => (
          <Numeric question={question} styles={specificStyle} {...this.props} />
        );
        break;
      case displayFormats.list:
        WrapperAnswer = () => (
          <List question={question} styles={specificStyle} {...this.props} />
        );
        break;
      default:
        break;
    }

    return (
      <React.Fragment>
        <WrapperAnswer />
        <Button
          style={styles.touchable}
          transparent
          onPress={() => this.setState({ toolTipVisible: true })}
        >
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
      </React.Fragment>
    );
  }
}

export default class Question extends React.PureComponent<Props, State> {
  render() {
    const { question } = this.props;

    // If this is not a question we return null
    if (question === undefined || question.type !== nodesType.question) {
      return null;
    }

    // If this is a question Formula we do not show it
    if (question.display_format === displayFormats.formula) {
      return null;
    }

    let specificStyle;

    // Define special style depending the proprity
    switch (question.priority) {
      case priorities.basic:
        specificStyle = styles.normal;
        break;
      default:
        specificStyle = {};
        break;
    }

    // Construct generic Component for the question
    return (
      <ListItem style={styles.condensed} noBorder key={question.id + '_item'}>
        <LabelQuestion
          key={question.id + '_label'}
          label={question.counter + 'x - ' + question.label}
          flex={0.65}
          marginLeft={0}
          marginRight={10}
        />
        <WrapperQuestion
          key={question.id + '_answer'}
          question={question}
          specificStyle={specificStyle}
          {...this.props}
        />
      </ListItem>
    );
  }
}
