// @flow

import * as React from 'react';
import type { NavigationScreenProps } from 'react-navigation';
import {
  categories,
  displayFormats,
  displayValues,
  priorities,
} from '../../../../frontend_service/constants';
import { liwiColors } from '../../../utils/constants';
import { styles } from './Question.factory.style';
import ModalWrapper from './ModalWrapper';
import Radio from '../DisplaysContainer/Radio';
import Boolean from '../DisplaysContainer/Boolean';
import Numeric from '../DisplaysContainer/Numeric';
import { Grid, Icon, Text } from 'native-base';
import { ColCenter, QuestionView } from '../../../template/layout';
import List from '../DisplaysContainer/List';

type Props = NavigationScreenProps & {};

type State = {};

export default class Question extends React.PureComponent<Props, State> {
  render() {
    const { question } = this.props;

    let specificStyle;

    let WrapperAnswer = () => null;
    let WrapperCategory = () => null;
    let WrapperRadiobutton = () => null;

    // Set style of question according to the priority
    switch (question.priority) {
      case priorities.triage:
        specificStyle = styles.triage;
        break;
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

    // Define display format and value
    // TODO : implement check boxes (and dropdown list)
    switch (question.display_format) {
      case displayFormats.radioButton:
        if (question.value_format === displayValues.bool) {
          WrapperAnswer = () => (
            <Boolean question={question} styles={specificStyle} />
          );
        } else if (question.value_format === displayValues.array) {
          WrapperRadiobutton = () => <Radio question={question} />;
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

    switch (question.category) {
      case categories.exposure:
        WrapperCategory = () => (
          <Icon
            style={styles.icon}
            name={'hands-helping'}
            type={'FontAwesome5'}
          />
        );
        break;
      case categories.physicalExam:
        WrapperCategory = () => (
          <Icon
            style={styles.icon}
            name={'human'}
            type={'MaterialCommunityIcons'}
          />
        );
        break;
      case categories.assessment:
        WrapperCategory = () => (
          <Icon
            style={styles.icon}
            name={'test-tube'}
            type={'MaterialCommunityIcons'}
          />
        );
        break;
      case categories.symptom:
        WrapperCategory = () => (
          <Icon style={styles.icon} name={'infocirlceo'} type={'AntDesign'} />
        );
        break;
      default:
        break;
    }

    return (
      <QuestionView elevation={1} key={question.id} style={specificStyle}>
        <Grid>
          <ColCenter
            key={question.id + '_cat'}
            size={1}
            style={styles.category}
          >
            <WrapperCategory />
          </ColCenter>
          <ColCenter
            size={4}
            style={styles.borderRight}
            key={question.id + '_label'}
          >
            <Text style={{ color: liwiColors.blackColor }}>
              {question.label}
            </Text>
          </ColCenter>
          <ColCenter
            size={3}
            style={styles.borderRight}
            key={question.id + '_answer'}
          >
            <WrapperAnswer />
          </ColCenter>
          <ColCenter size={1} key={question.id + '_modal'}>
            <ModalWrapper content={question.label} />
          </ColCenter>
        </Grid>
        <WrapperRadiobutton />
      </QuestionView>
    );
  }
}
