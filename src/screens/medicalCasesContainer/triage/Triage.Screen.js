// @flow

import React, { Suspense } from 'react';
import { Content, View } from 'native-base';

import { styles } from '../diagnosticsStrategyContainer/diagnosticsStrategy/DiagnosticsStrategy.style';
import LiwiLoader from '../../../utils/LiwiLoader';
import NavigationService from '../../../engine/navigation/Navigation.service';
import { questionsComplaintCategory } from '../../../../frontend_service/algorithm/questionsStage.algo';
import Boolean from '../../../components/QuestionsContainer/DisplaysContainer/Boolean';
import BasicMeasurements from '../../../components/BasicMeasurements';

const Stepper = React.lazy(() => import('../../../components/Stepper'));

export default class Triage extends React.Component {
  constructor(props) {
    super(props);

    const {
      app: { algorithm },
    } = props;

    NavigationService.setParamsAge(algorithm, 'Triage');

    this.state = {
      complaintCategories: questionsComplaintCategory(algorithm),
    };
  }

  render() {
    const {
      app: { t },
      navigation,
    } = this.props;

    const { complaintCategories } = this.state;

    const selectedPage = navigation.getParam('initialPage');

    return (
      <Suspense fallback={<LiwiLoader />}>
        <Stepper
          params={{ initialPage: 0 }}
          initialPage={selectedPage}
          validation={false}
          showTopStepper
          showBottomStepper
          onPageSelected={(e) => {
            navigation.setParams({
              initialPage: e,
            });
          }}
          icons={[
            // { name: 'heartbeat', type: 'FontAwesome5' },
            { name: 'stethoscope', type: 'FontAwesome5' },
            { name: 'thermometer', type: 'FontAwesome5' },
          ]}
          steps={[t('triage:chief'), t('triage:basic_measurement')]}
          backButtonTitle={t('medical_case:back')}
          nextButtonTitle={t('medical_case:next')}
          nextStage="Consultation"
          nextStageString={t('medical_case:consultation')}
        >
          {/* <View style={styles.pad}> */}
          {/*  {focus === 'didFocus' || focus === 'willFocus' ? ( */}
          {/*    <Suspense fallback={<LiwiLoader />}> */}
          {/*      <Questions questions={questionsFirstLookAssessment(algorithm)} selectedPage={selectedPage} pageIndex={0} /> */}
          {/*    </Suspense> */}
          {/*  ) : ( */}
          {/*    <LiwiLoader /> */}
          {/*  )} */}
          {/* </View> */}
          <View style={styles.flex}>
            <Suspense fallback={<LiwiLoader />}>
              <Content>
                <View flex-container-fluid>
                  {complaintCategories.map((question, i) => (
                    <Boolean key={`${question.id}_chief_boolean`} question={question} index={i} />
                  ))}
                </View>
              </Content>
            </Suspense>
          </View>
          <BasicMeasurements selectedPage={selectedPage} />
        </Stepper>
      </Suspense>
    );
  }
}
