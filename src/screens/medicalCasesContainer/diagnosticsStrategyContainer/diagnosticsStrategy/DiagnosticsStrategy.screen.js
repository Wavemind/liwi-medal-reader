// @flow

import { NavigationScreenProps } from 'react-navigation';
import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import find from 'lodash/find';
import HealthCaresQuestions from '../healthCaresQuestions';
import HealthCares from '../healthCares';
import { styles } from './DiagnosticsStrategy.style';
import Stepper from '../../../../components/Stepper';
import FinalDiagnosticsList from '../../../../components/FinalDiagnosticsList';

type Props = NavigationScreenProps & {};
type State = {};

export default class DiagnosesStrategy extends Component<Props, State> {
  shouldComponentUpdate(nextProps: Readonly<P>): boolean {
    if (nextProps.medicalCase.id === undefined) {
      return false;
    } else {
      return true;
    }
  }

  componentWillMount() {
    const {
      app: { t },
    } = this.props;

    const {
      navigation,
      medicalCase: { patient, nodes },
    } = this.props;

    const age = find(nodes, { reference: '1', category: 'demographic' });

    let stringAge;
    if (age === undefined) {
      stringAge = 'The birth date node is not find';
    } else {
      stringAge = age.value === null ? 'Age is not defined' : age.value + ' months';
    }

    navigation.setParams({
      title: t('navigation:diagnosticsstrategy'),
      headerRight: `${patient.firstname} ${patient.lastname} | ${stringAge}`,
    });
  }
  render() {
    const {
      app: { t },
    } = this.props;
    return (
      <Stepper
        ref={(ref: any) => {
          this.stepper = ref;
        }}
        validation={false}
        showTopStepper
        showBottomStepper
        icons={[{ name: 'add-alert', type: 'MaterialIcons' }, { name: 'question-answer', type: 'MaterialIcons' }, { name: 'healing', type: 'MaterialIcons' }]}
        steps={[t('medical_case:final_diagnoses'), t('medical_case:healthcares_questions'), t('medical_case:healthcares')]}
        backButtonTitle={t('medical_case:back')}
        nextButtonTitle={t('medical_case:next')}
        nextStage="finish"
        endMedicalCase
        nextStageString={t('medical_case:finish')}
      >
        <View style={styles.pad}>
          <ScrollView>
            <FinalDiagnosticsList key="diagnosesList" />
          </ScrollView>
        </View>
        <View style={styles.pad}>
          <HealthCaresQuestions key="wealthCaresQuestions" />
        </View>
        <View style={styles.pad}>
          <HealthCares key="healthCares" />
        </View>
      </Stepper>
    );
  }
}
