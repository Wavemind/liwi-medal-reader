// @flow

import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import Stepper from '../../../../components/Stepper';
import HealthCaresQuestions from '../HealthCaresQuestions';
import HealthCares from '../HealthCares';
import FinalDiagnosticsList from '../../../../components/FinalDiagnosticsList';
import { styles } from './DiagnosticsStrategy.style';

type Props = NavigationScreenProps & {};
type State = {};

export default class DiagnosesStrategy extends Component<Props, State> {
  componentWillMount() {
    const {
      navigation,
      medicalCase: { patient },
    } = this.props;
    navigation.setParams({
      title:
        'Diagnostics & Strategy : ' + patient.lastname + ' ' + patient.lastname,
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
        backButtonTitle="BACK"
        nextButtonTitle="NEXT"
        nextStage="Summary"
        nextStageString="FINISH & SUMMARY"
      >
        <View style={styles.pad}>
          <ScrollView>
            <FinalDiagnosticsList key="diognonseslist" />
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
