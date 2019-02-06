// @flow

import * as React from 'react';
import { View, Grid, Col, Row, Text, Icon, Button } from 'native-base';
import { styles } from './Question.style';
import type { NavigationScreenProps } from 'react-navigation';
import type { SessionsProviderState } from 'engine/contexts/Sessions.context';
import { getSession } from 'engine/api/LocalStorage';
import Boolean from '../Question/Boolean';
import Numeric from '../Question/Numeric';
import { QuestionView, ColCenter } from '../../../template/layout';
import { liwiColors } from '../../../utils/constants';
import Modal from '../../LiwiModal';
import ModalWrapper from './ModalWrapper';

type Props = NavigationScreenProps & {};

type State = {};

export default class Question extends React.Component<Props, State> {
  render() {
    const { question } = this.props;
    let specificStyle;

    let WrapperAnswer = () => null;
    let WrapperCategory = () => null;

    // TODO Change it to int LOOL
    switch (question.priority) {
      case 'triage':
        specificStyle = styles.triage;
        break;
      case 'priority':
        specificStyle = styles.priority;
        break;
      case 'normal':
        specificStyle = styles.normal;
        break;
      default:
        specificStyle = {};
        break;
    }

    switch (question.question_type) {
      case 'boolean':
        WrapperAnswer = () => (
          <Boolean question={question} styles={specificStyle} />
        );
        break;
      case 'numeric':
        WrapperAnswer = () => (
          <Numeric question={question} styles={specificStyle} />
        );
        break;
      default:
        break;
    }

    switch (question.category) {
      case 'comorbidities':
        WrapperCategory = () => (
          <Icon
            style={styles.icon}
            name={'layer-group'}
            type={'FontAwesome5'}
          />
        );
        break;
      case 'exposure':
        WrapperCategory = () => (
          <Icon
            style={styles.icon}
            name={'hands-helping'}
            type={'FontAwesome5'}
          />
        );
        break;
      case 'physicalExam':
        WrapperCategory = () => (
          <Icon
            style={styles.icon}
            name={'human'}
            type={'MaterialCommunityIcons'}
          />
        );
        break;
      case 'symptoms':
        WrapperCategory = () => (
          <Icon style={styles.icon} name={'infocirlceo'} type={'AntDesign'} />
        );
        break;
      default:
        break;
    }

    return (
      <QuestionView elevation={1}>
        <Grid>
          <ColCenter
            size={1}
            style={{
              ...styles.borderRight,
              flex: 1,
              flexDirection: 'row',
            }}
          >
            <WrapperCategory />
          </ColCenter>
          <ColCenter size={4} style={styles.borderRight}>
            <Text style={{ color: liwiColors.blackColor }}>
              {question.label}
            </Text>
          </ColCenter>
          <ColCenter size={3} style={styles.borderRight}>
            <WrapperAnswer />
          </ColCenter>
          <ColCenter size={1}>
            <ModalWrapper />
          </ColCenter>
        </Grid>
      </QuestionView>
    );
  }
}
