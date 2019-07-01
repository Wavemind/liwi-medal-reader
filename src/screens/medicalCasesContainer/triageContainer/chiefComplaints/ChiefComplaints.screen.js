// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import {
  Button,
  Text,
  View,
} from 'native-base';
import { ScrollView } from 'react-native';
import { styles } from './ChiefComplaints.style';
import i18n from '../../../../utils/i18n';
import { categories } from '../../../../../frontend_service/constants';

type Props = NavigationScreenProps & {};

type State = {};

export default class ChiefComplaint extends React.Component<Props, State> {
  // default settings
  state = {};

  render() {
    const { medicalCase } = this.props;

    let questions = medicalCase.nodes.filterByCategory(categories.chiefComplain);

    return (
      <ScrollView contentContainerStyle={styles.container}>
        {questions.length > 0 ? (
        <View style={styles.view}>
          <Button style={styles.button} light>
            <Text center>Respiratory complaint</Text>
          </Button>
          <Button style={styles.button}>
            <Text center>Ear / Noise / Mouth / Throat / Complaint</Text>
          </Button>
          <Button style={styles.button} light>
            <Text>1</Text>
          </Button>
          <Button style={styles.button} light>
            <Text>1</Text>
          </Button>
          <Button style={styles.button} light>
            <Text>1</Text>
          </Button>
          <Button style={styles.button}>
            <Text>1</Text>
          </Button>
          <Button style={styles.button} light>
            <Text>1</Text>
          </Button>
          <Button style={styles.button} light>
            <Text>1</Text>
          </Button>
          <Button style={styles.button}>
            <Text>1</Text>
          </Button>
        </View>) : (
          <View padding-auto margin-auto>
            <Text not-available>{i18n.t('work_case:no_questions')}</Text>
          </View>)}
        <View bottom-view columns>
          <Button light split>
            <Text>{i18n.t('form:back')}</Text>
          </Button>
          <Button light split>
            <Text>{i18n.t('form:next')}</Text>
          </Button>
        </View>
      </ScrollView>
    );
  }
}
