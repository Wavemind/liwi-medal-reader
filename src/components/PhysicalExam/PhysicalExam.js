// @flow

import * as React from 'react';
import { Text, View } from 'native-base';
import { Suspense } from 'react';
import { SectionList } from 'react-native';

import { styles } from './PhysicalExam.style';
import LiwiLoader from '../../utils/LiwiLoader';
import { questionsPhysicalExam } from '../../../frontend_service/algorithm/questionsStage.algo';
import QuestionFactory from '../QuestionsContainer/QuestionFactory';

export default class PhysicalExam extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.selectedPage === 1;
  }

  render() {
    const {
      app: { algorithm, answeredQuestionId, t },
    } = this.props;

    const physicalExamSystem = questionsPhysicalExam(algorithm, answeredQuestionId);
    const questions = physicalExamSystem.filter((system) => system.data.length > 0);

    return (
      <View style={styles.pad}>
        <Suspense fallback={<LiwiLoader />}>
          <SectionList
            sections={questions}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => <QuestionFactory question={item} key={`${item.id}_factory`} {...this.props} />}
            renderSectionHeader={({ section: { title } }) => <Text customTitle>{t(`systems:${title}`)}</Text>}
          />
        </Suspense>
      </View>
    );
  }
}
