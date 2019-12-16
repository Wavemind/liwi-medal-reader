// @flow

import React, { Suspense } from 'react';
import { Content, View } from 'native-base';

import { NavigationScreenProps } from 'react-navigation';
import { styles } from '../diagnosticsStrategyContainer/diagnosticsStrategy/DiagnosticsStrategy.style';
import { categories } from '../../../../frontend_service/constants';
import LiwiLoader from '../../../utils/LiwiLoader';
import type { StateApplicationContext } from '../../../engine/contexts/Application.context';
import { Toaster } from '../../../utils/CustomToast';

const Boolean = React.lazy(() => import('../../../components/QuestionsContainer/DisplaysContainer/Boolean'));
const Questions = React.lazy(() => import('../../../components/QuestionsContainer/Questions'));
const Stepper = React.lazy(() => import('../../../components/Stepper'));

type Props = NavigationScreenProps & {};

type State = StateApplicationContext & {};

export default class Triage extends React.Component<Props, State> {
  componentWillMount() {
    const {
      navigation,
      medicalCase: { patient },
    } = this.props;
    navigation.setParams({
      title: 'Triage',
      headerRight: patient.firstname + ' ' + patient.lastname,
    });
  }

  state = {
    widthView: 0,
  };

  render() {
    const {
      app: { t },
      medicalCase,
      focus,
      navigation,
    } = this.props;

    let firstLookAssessement = [];

    const ordersFirstLookAssessment = medicalCase.triage.orders[categories.firstLookAssessment];

    ordersFirstLookAssessment.map((order) => {
      firstLookAssessement.push(medicalCase.nodes[order]);
    });

    const { widthView } = this.state;

    const orders = medicalCase.triage.orders[categories.chiefComplaint];
    let chiefComplaint = [];

    orders.map((order) => {
      chiefComplaint.push(medicalCase.nodes[order]);
    });

    let vitalSigns = [];
    const orderedQuestions = medicalCase.triage.orders[categories.vitalSign];

    orderedQuestions.map((orderedQuestion) => {
      let question = medicalCase.nodes[orderedQuestion];
      if (question.isDisplayedInTriage(medicalCase)) {
        vitalSigns.push(question);
      }
    });

    let chiefComplaintReady = chiefComplaint.every((cc) => cc.answer !== null);
    let selectedPage = navigation.getParam('initialPage');
    // Denied access to Basic measurement step if all chief complaints are not answered
    if (selectedPage === 2 && !chiefComplaintReady) {
      selectedPage = 1;
      navigation.setParams({
        initialPage: 1,
      });
      Toaster(t('triage:not_allowed'), { type: 'danger' }, { duration: 50000 });
    }

    return (
      <Suspense fallback={null}>
        <Stepper
          params={{ initialPage: 0 }}
          t={t}
          ref={(ref: any) => {
            this.stepper = ref;
          }}
          validation={false}
          chiefComplaintReady={chiefComplaintReady}
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
            { name: 'eye-plus', type: 'MaterialCommunityIcons' },
            { name: 'view-module', type: 'MaterialIcons' },
            { name: 'healing', type: 'MaterialIcons' },
          ]}
          steps={[t('triage:first_look_assessment'), t('triage:chief'), t('triage:vital')]}
          backButtonTitle={t('medical_case:back')}
          nextButtonTitle={t('medical_case:next')}
          nextStage="Consultation"
          nextStageString={t('medical_case:consultation')}
        >
          <View style={styles.pad}>
            {focus === 'didFocus' ? (
              <Suspense fallback={null}>
                <Questions questions={firstLookAssessement} selectedPage={selectedPage} pageIndex={0} />
              </Suspense>
            ) : (
              <LiwiLoader />
            )}
          </View>
          <View style={styles.pad}>
            {focus === 'didFocus' ? (
              <Suspense fallback={null}>
                <Content>
                  <View
                    flex-container-fluid
                    onLayout={async (p) => {
                      let w = await p.nativeEvent;
                      this.setState({ widthView: w.layout.width });
                    }}
                  >
                    {chiefComplaint.map((question, i) => (
                      <Boolean
                        key={question.id + 'chief_boolean'}
                        widthView={widthView}
                        question={question}
                        index={i}
                        selectedPage={selectedPage}
                        pageIndex={1}
                      />
                    ))}
                  </View>
                </Content>
              </Suspense>
            ) : (
              <LiwiLoader />
            )}
          </View>
          <View style={styles.pad}>
            {focus === 'didFocus' ? (
              <Suspense fallback={null}>
                <Questions questions={vitalSigns} selectedPage={selectedPage} pageIndex={2} />
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
