// @flow

import React, { Component, Suspense } from 'react';
import { ScrollView, View } from 'react-native';

import { styles } from './DiagnosticsStrategy.style';
import NavigationService from '../../../../engine/navigation/Navigation.service';
import LiwiLoader from '../../../../utils/LiwiLoader';

const FinalDiagnosticsList = React.lazy(() => import('../../../../components/FinalDiagnosticsList'));
const MedicinesFormulations = React.lazy(() => import('../medicinesFormulation'));
const HealthCaresQuestions = React.lazy(() => import('../healthCaresQuestions'));
const Stepper = React.lazy(() => import('../../../../components/Stepper'));
const HealthCares = React.lazy(() => import('../healthCares'));
const Medicines = React.lazy(() => import('../medicines'));

export default class DiagnosesStrategy extends Component {
  constructor(props) {
    super(props);

    const {
      app: { t, algorithm },
    } = props;

    NavigationService.setParamsAge(algorithm, t('navigation:diagnosticsstrategy'));
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
      <Suspense fallback={<LiwiLoader />}>
        <Stepper
          params={{ initialPage: 0 }}
          t={t}
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
            { name: 'diagnoses', type: 'FontAwesome5' },
            { name: 'comment-medical', type: 'FontAwesome5' },
            { name: 'pills', type: 'FontAwesome5' },
            { name: 'balance-scale', type: 'FontAwesome5' },
            { name: 'notes-medical', type: 'FontAwesome5' },
          ]}
          steps={[t('medical_case:final_diagnoses'), t('medical_case:conditions'), t('medical_case:medicines'), t('medical_case:medicines_formulation'), t('medical_case:healthcares')]}
          backButtonTitle={t('medical_case:back')}
          nextButtonTitle={t('medical_case:next')}
          nextStage="finish"
          endMedicalCase
          nextStageString={t('medical_case:finish')}
        >
          <View style={styles.pad}>
            <ScrollView>
              <Suspense fallback={<LiwiLoader />}>
                <FinalDiagnosticsList key="diagnosesList" selectedPage={selectedPage} pageIndex={0} />
              </Suspense>
            </ScrollView>
          </View>
          <View style={styles.pad}>
            <Suspense fallback={<LiwiLoader />}>
              <HealthCaresQuestions key="HealthCaresQuestions" selectedPage={selectedPage} pageIndex={1} />
            </Suspense>
          </View>
          <View style={styles.pad}>
            <ScrollView>
              <Suspense fallback={<LiwiLoader />}>
                <Medicines key="Medicines" selectedPage={selectedPage} pageIndex={2} />
              </Suspense>
            </ScrollView>
          </View>
          <View style={styles.pad}>
            <Suspense fallback={<LiwiLoader />}>
              <MedicinesFormulations key="MedicinesFormulations" selectedPage={selectedPage} pageIndex={3} />
            </Suspense>
          </View>
          <View style={styles.pad}>
            <Suspense fallback={<LiwiLoader />}>
              <HealthCares key="healthCares" selectedPage={selectedPage} pageIndex={4} />
            </Suspense>
          </View>
        </Stepper>
      </Suspense>
    );
  }
}
