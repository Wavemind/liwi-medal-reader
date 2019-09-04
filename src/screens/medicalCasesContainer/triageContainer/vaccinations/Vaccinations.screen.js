// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Button, Text } from 'native-base';
import {
  categories,
  medicalCaseStatus,
} from '../../../../../frontend_service/constants';
import type { StateApplicationContext } from '../../../../engine/contexts/Application.context';
import QuestionList from '../../../../components/Triage/QuestionList';

type Props = NavigationScreenProps & {};
type State = StateApplicationContext & {};

// eslint-disable-next-line react/prefer-stateless-function
export default class Vaccinations extends React.Component<Props, State> {
  render() {
    const { medicalCase, setStatus, navigation } = this.props;

    let questions = medicalCase.nodes.filterByCategory(categories.vaccine);

    return [
      <QuestionList questions={questions} key="vaccination+questions" />,
      <Button
        key="vaccination+button"
        style={{
          flexDirection: 'row-reverse',
        }}
        onPress={() => {
          setStatus('status', medicalCaseStatus.waitingConsultation.name);
          navigation.navigate('MedicalCaseList');
        }}
      >
        <Text>Finish Vaccinations</Text>
      </Button>,
    ];
  }
}
