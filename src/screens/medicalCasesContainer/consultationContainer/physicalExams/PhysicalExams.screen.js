// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { categories } from '../../../../../frontend_service/constants';
import QuestionsPerChiefComplaint from '../../../../components/Consultation/QuestionsPerChiefComplaint';

type Props = NavigationScreenProps & {};
type State = {};

export default class PhysicalExams extends React.Component<Props, State> {
  // default settings
  state = {};

  render() {
    return (
      <QuestionsPerChiefComplaint category={categories.physicalExam} />
    );
  }
}
