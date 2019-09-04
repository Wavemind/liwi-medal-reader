// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Button, Text } from 'native-base';
import {
  categories,
  medicalCaseStatus,
} from '../../../../../frontend_service/constants';
import QuestionsPerChiefComplaint from '../../../../components/Consultation/QuestionsPerChiefComplaint';

type Props = NavigationScreenProps & {};
type State = {};

export default class PhysicalExams extends React.Component<Props, State> {
  // default settings
  state = {};

  render() {
    const { setStatus, navigation } = this.props;

    return [
      <QuestionsPerChiefComplaint
        category={categories.physicalExam}
        key="physical_exam-questions"
      />,
      <Button
        key="physical_exam+button"
        onPress={() => {
          setStatus('status', medicalCaseStatus.waitingTest.name);
          navigation.navigate('MedicalCaseList');
        }}
      >
        <Text>Finish Physical Exams</Text>
      </Button>,
    ];
  }
}
