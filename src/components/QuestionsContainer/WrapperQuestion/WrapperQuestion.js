import * as React from 'react';
import { View } from 'react-native';

import { displayFormats, valueFormats } from '../../../../frontend_service/constants';
import Boolean from '../DisplaysContainer/Boolean';
import Numeric from '../DisplaysContainer/Numeric';
import String from '../DisplaysContainer/String';
import Date from '../DisplaysContainer/Date';
import List from '../DisplaysContainer/List';
import Formula from '../DisplaysContainer/Formula';

export default class WrapperQuestion extends React.Component<Props, State> {
  // Lifecycle for optimization
  shouldComponentUpdate(nextProps) {
    const { question } = this.props;
    return nextProps.question.answer !== question.answer || nextProps.question.value !== question.value;
  }

  render() {
    const { question, flex } = this.props;

    // By default no component
    let WrapperAnswer = () => null;

    // Depending the format of the question we call the right component
    // Boolean | Numeric | String | Date | List
    switch (question.display_format) {
      case displayFormats.radioButton:
        if (question.value_format === valueFormats.bool) {
          WrapperAnswer = () => <Boolean question={question} {...this.props} />;
        }
        break;
      case displayFormats.input:
        WrapperAnswer = () => <Numeric question={question} {...this.props} />;
        break;
      case displayFormats.string:
        WrapperAnswer = () => <String question={question} {...this.props} />;
        break;
      case displayFormats.date:
        WrapperAnswer = () => <Date question={question} {...this.props} />;
        break;
      case displayFormats.dropDownList:
        WrapperAnswer = () => <List question={question} {...this.props} />;
        break;
      case displayFormats.reference:
      case displayFormats.formula:
        WrapperAnswer = () => <Formula question={question} {...this.props} />;
        break;
      default:
        break;
    }

    return (
      <View flex={flex}>
        <WrapperAnswer />
      </View>
    );
  }
}
