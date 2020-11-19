// @flow

import React, { Suspense } from 'react';
import { View, Text, Icon } from 'native-base';

import { ScrollView, SectionList, TouchableOpacity } from 'react-native';
import LiwiLoader from '../../../utils/LiwiLoader';
import NavigationService from '../../../engine/navigation/Navigation.service';
import { questionsMedicalHistory, questionsPhysicalExam } from '../../../../frontend_service/algorithm/questionsStage.algo';
import { styles } from '../diagnosticsStrategyContainer/diagnosticsStrategy/DiagnosticsStrategy.style';
import Comment from '../../../components/Comment';
import System from '../../../components/Consultation/System';
import { displayFormats } from '../../../../frontend_service/constants';
import { ViewQuestion } from '../../../template/layout';
import Autocomplete from '../../../components/QuestionsContainer/DisplaysContainer/Autocomplete';
import QuestionFactory from '../../../components/QuestionsContainer/QuestionFactory';
import i18n from '../../../utils/i18n';

const Stepper = React.lazy(() => import('../../../components/Stepper'));

export default class Consultation extends React.Component {
  constructor(props) {
    super(props);

    const {
      app: { algorithm },
    } = props;
    NavigationService.setParamsAge(algorithm, 'Consultation');
  }

  _renderMedicalHistory = () => {
    const {
      app: { algorithm, answeredQuestionId, t },
    } = this.props;

    const medicalHistorySystem = questionsMedicalHistory(algorithm, answeredQuestionId);
    console.log(medicalHistorySystem);
    // return (
    //   <Suspense fallback={<LiwiLoader />}>
    //     <ScrollView>
    //       {Object.keys(medicalHistorySystem).map((keySystem) => (
    //         <System system={keySystem} key={`system_${keySystem}`} questions={medicalHistorySystem[keySystem]} />
    //       ))}
    //     </ScrollView>
    //   </Suspense>
    // );

    return (
      <Suspense fallback={<LiwiLoader />}>
        <SectionList
          sections={medicalHistorySystem}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => {
            if (algorithm.nodes[item.id].display_format === displayFormats.autocomplete) {
              return (
                <View key={`${item.id}_ref_view`}>
                  <View style={styles.flexRow}>
                    <View flex={0.12}>
                      <TouchableOpacity style={styles.touchable} transparent onPress={() => this.openModal(item.id)}>
                        <Icon type="AntDesign" name="info" style={styles.iconInfo} />
                      </TouchableOpacity>
                    </View>
                    <ViewQuestion marginRight={10} marginLeft={0}>
                      <Text style={styles.questionLabel} size-auto>
                        {algorithm.nodes[item.id].label} {algorithm.nodes[item.id].is_mandatory ? '*' : null}
                      </Text>
                    </ViewQuestion>
                  </View>
                  <Autocomplete key={`${item.id}_ref_factory`} question={item} {...this.props} />
                </View>
              );
            }

            return <QuestionFactory question={item} key={`${item.id}_factory`} {...this.props} />;
          }}
          renderSectionHeader={({ section: { title } }) => <Text customTitle>{t(`systems:${title}`)}</Text>}
        />
      </Suspense>
    );
  };

  _renderPhysicalExam = () => {
    const {
      app: { algorithm, answeredQuestionId },
    } = this.props;

    // const physicalExamSystem = questionsPhysicalExam(algorithm, answeredQuestionId);

    return (
      <Suspense fallback={<LiwiLoader />}>
        {/* <ScrollView nestedScrollEnabled> */}
        {/*  {Object.keys(physicalExamSystem).map((keySystem) => ( */}
        {/*    <System system={keySystem} key={`system_${keySystem}`} questions={physicalExamSystem[keySystem]} /> */}
        {/*  ))} */}
        {/* </ScrollView> */}
      </Suspense>
    );
  };

  render() {
    const {
      app: { t },
      focus,
      navigation,
      medicalCase,
    } = this.props;

    const selectedPage = navigation.getParam('initialPage');

    return (
      <Suspense fallback={<LiwiLoader />}>
        <Stepper
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
            { name: 'comment-medical', type: 'FontAwesome5' },
            { name: 'male', type: 'FontAwesome5' },
            { name: 'comment', type: 'FontAwesome5' },
          ]}
          steps={[t('consultation:medical_history'), t('consultation:physical_exam'), t('consultation:comment')]}
          backButtonTitle={t('medical_case:back')}
          nextButtonTitle={t('medical_case:next')}
          nextStage="Tests"
          nextStageString={t('medical_case:test')}
        >
          <View style={styles.pad}>{focus === 'didFocus' || focus === 'willFocus' ? this._renderMedicalHistory() : <LiwiLoader />}</View>
          <View style={styles.pad}>{focus === 'didFocus' || focus === 'willFocus' ? this._renderPhysicalExam() : <LiwiLoader />}</View>
          <View style={styles.pad}>
            {focus === 'didFocus' || focus === 'willFocus' ? (
              <Suspense fallback={<LiwiLoader />}>
                <Comment pageIndex={1} selectedPage={selectedPage} comment={medicalCase.comment} />
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
