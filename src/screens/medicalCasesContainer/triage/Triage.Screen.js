// @flow

import React, { Suspense } from 'react';
import { Content, View } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';

import { styles } from '../diagnosticsStrategyContainer/diagnosticsStrategy/DiagnosticsStrategy.style';
import LiwiLoader from '../../../utils/LiwiLoader';
import type { StateApplicationContext } from '../../../engine/contexts/Application.context';
import NavigationService from '../../../engine/navigation/Navigation.service';
import { questionsBasicMeasurements, questionsComplaintCategory, questionsFirstLookAssessement } from '../../../../frontend_service/algorithm/questionsStage.algo';
import Boolean from '../../../components/QuestionsContainer/DisplaysContainer/Boolean';

const Questions = React.lazy(() => import('../../../components/QuestionsContainer/Questions'));
const Stepper = React.lazy(() => import('../../../components/Stepper'));

type Props = NavigationScreenProps & {};
type State = StateApplicationContext & {};

export default class Triage extends React.Component<Props, State> {
  state = {
    widthView: 0,
    complaintCategories: questionsComplaintCategory()
  };

  componentDidMount() {
    NavigationService.setParamsAge('Triage');
  }

  render() {
    const {
      app: { t },
      focus,
      navigation,
    } = this.props;

    const { widthView, complaintCategories } = this.state;

    const selectedPage = navigation.getParam('initialPage');

    return (
      <Suspense fallback={<LiwiLoader />}>
        <Stepper
          params={{ initialPage: 0 }}
          t={t}
          validation={false}
          showTopStepper
          initial
          onPageSelected={(e) => {
            navigation.setParams({
              initialPage: e,
            });
          }}
          initialPage={selectedPage}
          showBottomStepper
          icons={[
            { name: 'heartbeat', type: 'FontAwesome5' },
            { name: 'stethoscope', type: 'FontAwesome5' },
            { name: 'thermometer', type: 'FontAwesome5' },
          ]}
          steps={[t('triage:first_look_assessment'), t('triage:chief'), t('triage:basic_measurement')]}
          backButtonTitle={t('medical_case:back')}
          nextButtonTitle={t('medical_case:next')}
          nextStage="Consultation"
          nextStageString={t('medical_case:consultation')}
        >
          <View style={styles.pad}>
            {focus === 'didFocus' || focus === 'willFocus' ? (
              <Suspense fallback={<LiwiLoader />}>
                <Questions questions={questionsFirstLookAssessement()} selectedPage={selectedPage} pageIndex={0} />
              </Suspense>
            ) : (
              <LiwiLoader />
            )}
          </View>
          <View style={styles.flex}>
            {focus === 'didFocus' || focus === 'willFocus' ? (
              <Suspense fallback={<LiwiLoader />}>
                <Content>
                  <View
                    flex-container-fluid
                    onLayout={async (p) => {
                      const w = await p.nativeEvent;
                      this.setState({ widthView: w.layout.width });
                    }}
                  >
                    {complaintCategories.map((question, i) => (
                      <Boolean key={`${question.id}chief_boolean`} widthView={widthView} question={question} index={i} selectedPage={selectedPage} pageIndex={1} />
                    ))}
                  </View>
                </Content>
              </Suspense>
            ) : (
              <LiwiLoader />
            )}
          </View>
          <View style={styles.pad}>
            {focus === 'didFocus' || focus === 'willFocus' ? (
              <Suspense fallback={<LiwiLoader />}>
                <Questions questions={questionsBasicMeasurements()} selectedPage={selectedPage} pageIndex={2} />
              </Suspense>
            ) : (
              <LiwiLoader />
            )}
          </View>
        </Stepper>
      </Suspense>
    );
  }
}
