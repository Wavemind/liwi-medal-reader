// @flow

import * as React from 'react';
import type { NavigationScreenProps } from 'react-navigation';
import {
  categories,
  displayFormats,
  displayValues, nodesType,
  priorities,
  typeNode,
} from '../../../../frontend_service/constants';
import { liwiColors } from '../../../utils/constants';
import { styles } from './Question.factory.style';
import Boolean from '../DisplaysContainer/Boolean';
import Numeric from '../DisplaysContainer/Numeric';
import { Grid, Icon, ListItem, Text, View } from 'native-base';
import { ColCenter, ViewQuestion } from '../../../template/layout';
import List from '../DisplaysContainer/List';

type Props = NavigationScreenProps & {};

type State = {};

class LabelQuestion extends React.PureComponent<{ label: any }> {
  render() {
    return (
      <ViewQuestion>
        <Text style={{ color: liwiColors.blackColor }} size-auto>
          {this.props.label}
        </Text>
      </ViewQuestion>
    );
  }
}

class WrapperQuestion extends React.Component<{}> {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.question.answer !== this.props.question.answer ||
      nextProps.question.value !== this.props.question.value
    );
  }

  render() {
    const { question, specificStyle } = this.props;
    let WrapperAnswer = () => null;

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

    if (question.type !== nodesType.q) {
      return null;
    }

    let specificStyle;

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

    // Set style of question according to the priority
    // Define display format and value
    // TODO : implement check boxes (and dropdown list)
    // TODO move modalwrapper higher in component. we want only one initial render for it

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
