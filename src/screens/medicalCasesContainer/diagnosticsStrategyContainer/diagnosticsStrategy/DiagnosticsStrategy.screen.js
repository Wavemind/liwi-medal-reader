// @flow

import { NavigationScreenProps } from 'react-navigation';
import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import HealthCaresQuestions from '../healthCaresQuestions';
import HealthCares from '../healthCares';
import { styles } from './DiagnosticsStrategy.style';
import Stepper from '../../../../components/Stepper';
import FinalDiagnosticsList from '../../../../components/FinalDiagnosticsList';

type Props = NavigationScreenProps & {};
type State = {};

export default class DiagnosesStrategy extends Component<Props, State> {
  componentWillMount() {
    const {
      app: { t },
    } = this.props;

    const {
      navigation,
      medicalCase: { patient },
    } = this.props;
    navigation.setParams({
      title: t('navigation:diagnosticsstrategy'),
      headerRight: patient.firstname + ' ' + patient.lastname,
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
        icons={[
          { name: 'add-alert', type: 'MaterialIcons' },
          { name: 'question-answer', type: 'MaterialIcons' },
          { name: 'healing', type: 'MaterialIcons' },
        ]}
        steps={[
          t('medical_case:final_diagnoses'),
          t('medical_case:healthcares_questions'),
          t('medical_case:healthcares'),
        ]}
        backButtonTitle={t('medical_case:back')}
        nextButtonTitle={t('medical_case:next')}
        nextStage="finish"
        endMedicalCase
        nextStageString={t('medical_case:finish')}
      >
        <View style={styles.pad}>
          <ScrollView>
            <FinalDiagnosticsList key="diognoseslist" />
          </ScrollView>
        </View>
        <View style={styles.pad}>
          <HealthCaresQuestions key="wealthCaresQuestions" />
        </View>
        <View style={styles.pad}>
          <HealthCares key="sealthCares" />
        </View>
      </Stepper>
    );
  }
}
