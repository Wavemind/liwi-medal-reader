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

type Props = NavigationScreenProps & {};

type State = {};

export default class ChiefComplaint extends React.Component<Props, State> {
  // default settings
  state = {};

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.view}>
          <Button style={styles.button}>
            <Text center>Respiratory complaint</Text>
          </Button>
          <Button style={styles.button}>
            <Text center>Ear / Noise / Mouth / Throat / Complaint</Text>
          </Button>
          <Button style={styles.button}>
            <Text>1</Text>
          </Button>
          <Button style={styles.button}>
            <Text>1</Text>
          </Button>
          <Button style={styles.button}>
            <Text>1</Text>
          </Button>
          <Button style={styles.button}>
            <Text>1</Text>
          </Button>
          <Button style={styles.button}>
            <Text>1</Text>
          </Button>
          <Button style={styles.button}>
            <Text>1</Text>
          </Button>
          <Button style={styles.button}>
            <Text>1</Text>
          </Button>

        </View>
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
