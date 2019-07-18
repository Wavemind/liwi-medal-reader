// @flow

import * as React from 'react';
import type { NavigationScreenProps } from 'react-navigation';
import { ListItem, Text } from 'native-base';
import { displayFormats, displayValues, nodesType, priorities } from '../../../../frontend_service/constants';
import { liwiColors } from '../../../utils/constants';
import { styles } from './Question.factory.style';
import Boolean from '../DisplaysContainer/Boolean';
import Numeric from '../DisplaysContainer/Numeric';
import { ViewQuestion } from '../../../template/layout';
import List from '../DisplaysContainer/List';

type Props = NavigationScreenProps & {};

type State = {};

function LabelQuestion(props: { label: String }) {
  const { label } = props;
  return (
    <ViewQuestion>
      <Text style={{ color: liwiColors.blackColor }} size-auto>
        {label}
      </Text>
    </ViewQuestion>
  );
}

class WrapperQuestion extends React.Component<Props, State> {

  // Lifecycle for optimization
  shouldComponentUpdate(nextProps) {
    const { question } = this.props;
    return (
      nextProps.question.answer !== question.answer ||
      nextProps.question.value !== question.value
    );
  }

  render() {
    const { question, specificStyle } = this.props;
    // By default no component
    let WrapperAnswer = () => null;

    // Depending the format of the question we call the right component
    // Boolean | Numeric | List
    switch (question.display_format) {
      case displayFormats.radioButton:
        if (question.value_format === displayValues.bool) {
          WrapperAnswer = () => (
            <Boolean question={question} styles={specificStyle} />
          );
        }
        break;
      case displayFormats.input:
        WrapperAnswer = () => (
          <Numeric question={question} styles={specificStyle} />
        );
        break;
      case displayFormats.list:
        WrapperAnswer = () => (
          <List question={question} styles={specificStyle} />
        );
        break;
      default:
        break;
    }

    return <WrapperAnswer />;
  }
}

export default class Question extends React.PureComponent<Props, State> {
  render() {
    const { question } = this.props;

    // If this is not a question we return null
    if (question.type !== nodesType.q) {
      return null;
    }

    let specificStyle;

    // Define special style depending the proprity
    switch (question.priority) {
      case priorities.mandatory:
        specificStyle = styles.mandatory;
        break;
      case priorities.basic:
        specificStyle = styles.normal;
        break;
      default:
        specificStyle = {};
        break;
    }

    // Construct generic Component for the question
    return (
      <ListItem block noBorder key={question.id + '_item'}>
        <LabelQuestion key={question.id + '_label'} label={question.label} />
        <WrapperQuestion
          key={question.id + '_answer'}
          question={question}
          specificStyle={specificStyle}
        />
      </ListItem>
    );
  }
}
