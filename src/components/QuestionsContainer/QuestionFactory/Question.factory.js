// @flow

import * as React from 'react';
import { Grid, Icon, Text } from 'native-base';
import { styles } from './Question.style';
import type { NavigationScreenProps } from 'react-navigation';
import Boolean from '../Question/Boolean';
import Numeric from '../Question/Numeric';
import { ColCenter, QuestionView } from '../../../template/layout';
import { liwiColors } from '../../../utils/constants';
import ModalWrapper from './ModalWrapper';
import Radio from '../Question/Radio/Radio';

type Props = NavigationScreenProps & {};

type State = {};

export default class Question extends React.PureComponent<Props, State> {
  render() {
    const { question } = this.props;
    let specificStyle;

    let WrapperAnswer = () => null;
    let WrapperCategory = () => null;
    let WrapperRadiobutton = () => null;

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

    switch (question.display_format) {
      case 'Radiobutton':
        WrapperAnswer = () => (
          <Boolean question={question} styles={specificStyle} />
        );
        WrapperRadiobutton = () => <Radio question={question} />;
        break;
      case 'Input':
        WrapperAnswer = () => (
          <Numeric question={question} styles={specificStyle} />
        );
        break;
      default:
        break;
    }

    switch (question.category) {
      case 'Comorbidity':
        WrapperCategory = () => (
          <Icon
            style={styles.icon}
            name={'layer-group'}
            type={'FontAwesome5'}
          />
        );
        break;
      case 'Exposure':
        WrapperCategory = () => (
          <Icon
            style={styles.icon}
            name={'hands-helping'}
            type={'FontAwesome5'}
          />
        );
        break;
      case 'Physical exam':
        WrapperCategory = () => (
          <Icon
            style={styles.icon}
            name={'human'}
            type={'MaterialCommunityIcons'}
          />
        );
        break;
      case 'Assessment/Test':
        WrapperCategory = () => (
          <Icon
            style={styles.icon}
            name={'test-tube'}
            type={'MaterialCommunityIcons'}
          />
        );
        break;
      case 'Symptom':
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
            style={{
              ...styles.borderRight,
              flex: 1,
              flexDirection: 'row',
            }}
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
