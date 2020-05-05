// @flow

import { NavigationScreenProps } from "react-navigation";
import React, { Component } from "react";
import { ScrollView, View } from "react-native";
import HealthCaresQuestions from "../healthCaresQuestions";
import HealthCares from "../healthCares";
import { styles } from "./DiagnosticsStrategy.style";
import Stepper from "../../../../components/Stepper";
import FinalDiagnosticsList from "../../../../components/FinalDiagnosticsList";
import NavigationService from "../../../../engine/navigation/Navigation.service";
import Medicines from "../medicines";
import MedicinesFormulations from "../medicinesFormulation";

type Props = NavigationScreenProps & {};
type State = {};

export default class DiagnosesStrategy extends Component<Props, State> {
  componentDidMount() {
    const {
      app: { t },
    } = this.props;

    const { navigation } = this.props;

    NavigationService.setParamsAge(t('navigation:diagnosticsstrategy'));
  }

  render() {
    const {
      app: { t },
      medicalCase,
      navigation,
    } = this.props;

    if (medicalCase.id === undefined) {
      return null;
    }

    const selectedPage = navigation.getParam('initialPage');

    return (
      <Stepper
        params={{ initialPage: 0 }}
        t={t}
        ref={(ref: any) => {
          this.stepper = ref;
        }}
        validation={false}
        showTopStepper
        onPageSelected={(e) => {
          navigation.setParams({
            initialPage: e,
          });
        }}
        initialPage={selectedPage}
        showBottomStepper
        icons={[
          { name: 'add-alert', type: 'MaterialIcons' },
          { name: 'question-answer', type: 'MaterialIcons' },
          { type: 'FontAwesome5', name: 'pills' },
          { type: 'FontAwesome', name: 'balance-scale' },
          { name: 'healing', type: 'MaterialIcons' },
        ]}
        steps={[t('medical_case:final_diagnoses'), t('medical_case:conditions'), t('medical_case:medecines'), t('medical_case:medecines_formulation'), t('medical_case:healthcares')]}
        backButtonTitle={t('medical_case:back')}
        nextButtonTitle={t('medical_case:next')}
        nextStage="finish"
        endMedicalCase
        nextStageString={t('medical_case:finish')}
      >
        <View style={styles.pad}>
          <ScrollView>
            <FinalDiagnosticsList key="diagnosesList" selectedPage={selectedPage} pageIndex={0} />
          </ScrollView>
        </View>
        <View style={styles.pad}>
          <HealthCaresQuestions key="HealthCaresQuestions" selectedPage={selectedPage} pageIndex={1} />
        </View>
        <View style={styles.pad}>
          <ScrollView>
            <Medicines key="Medicines" selectedPage={selectedPage} pageIndex={2} />
          </ScrollView>
        </View>
        <View style={styles.pad}>
          <MedicinesFormulations key="MedicinesFormulations" selectedPage={selectedPage} pageIndex={3} />
        </View>
        <View style={styles.pad}>
          <HealthCares key="healthCares" selectedPage={selectedPage} pageIndex={4} />
        </View>
      </Stepper>
    );
  }
}
