// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Text, View } from 'native-base';
import { ScrollView } from 'react-native';
import { categories } from '../../../../frontend_service/constants';
import Questions from '../../QuestionsContainer/Questions';
import { styles } from './QuestionsPerChiefComplaint.style';
import ChiefComplaint from '../ChiefComplaint';

type Props = NavigationScreenProps & {};

type State = {};

export default class QuestionsPerChiefComplaint extends React.Component<Props, State> {

  // default settings
  state = {};

  // TODO opti mize this with scu ! @quentin

  render() {
    const { medicalCase, category } = this.props;

    let chiefComplaints = medicalCase.nodes.filterByCategory(categories.chiefComplaint);

    console.log('render chiefs', chiefComplaints);

    return (
      <ScrollView contentContainerStyle={styles.container}>
        {chiefComplaints.map((chiefComplaint) => (
          <ChiefComplaint chiefComplaint={chiefComplaint} category={category} key={'chiefComplaint' + chiefComplaint.id} />
        ))}
      </ScrollView>
    );
  }
}
