// @flow

import * as React from 'react';
import type { NavigationScreenProps } from 'react-navigation';
import { categories, displayFormats, displayValues, priorities } from '../../../../frontend_service/constants';
import { liwiColors } from '../../../utils/constants';
import { styles } from './Question.factory.style';
import ModalWrapper from './ModalWrapper';
import Boolean from '../DisplaysContainer/Boolean';
import Numeric from '../DisplaysContainer/Numeric';
import { Grid, Icon, Text } from 'native-base';
import { ColCenter, QuestionView } from '../../../template/layout';
import List from '../DisplaysContainer/List';

type Props = NavigationScreenProps & {};

type State = {};

class IconCategoryQuestion extends React.PureComponent<{}> {
  render() {
    let WrapperCategory = () => null;

    switch (this.props.category) {
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
      <ColCenter size={1} style={styles.category}>
        <WrapperCategory />
      </ColCenter>
    );
  }
}

class LabelQuestion extends React.PureComponent<{ label: any }> {
  render() {
    return (
      <ColCenter size={4} style={styles.borderRight}>
        <Text style={{ color: liwiColors.blackColor }} size-auto>
          {this.props.label}
        </Text>
      </ColCenter>
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

    return (
      <ColCenter size={3} style={styles.borderRight}>
        <WrapperAnswer />
      </ColCenter>
    );
  }
}

export default class Question extends React.PureComponent<Props, State> {
  render() {
    const { question } = this.props;
    let specificStyle;

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


    // Set style of question according to the priority
    // Define display format and value
    // TODO : implement check boxes (and dropdown list)
    // TODO move modalwrapper higher in component. we want only one initial render for it

    return (
      <QuestionView elevation={1} key={question.id} style={specificStyle}>
        <Grid>
          <IconCategoryQuestion
            key={question.id + '_cat'}
            category={question.category}
          />
          <LabelQuestion key={question.id + '_label'} label={question.label} />
          <WrapperQuestion
            key={question.id + '_answer'}
            question={question}
            specificStyle={specificStyle}
          />
          <ColCenter size={1} key={question.id + '_modal'}>
            <ModalWrapper content={question.label} />
          </ColCenter>
        </Grid>
        {/*<WrapperRadiobutton/>*/}
      </QuestionView>
    );
  }
}
