// @flow

import * as React from 'react';
import { Text } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { ScrollView } from 'react-native';

type Props = NavigationScreenProps & {};

type State = {};

export default class MedicalCase extends React.Component<Props, State> {
  state = { medicalCases: [] };

  componentWillMount() {}

  render() {
    const {
      medicalCase: {
        patient: { firstname, lastname, email, birthdate },
      },
    } = this.props;

    return (
      <ScrollView>
        <Text>Medical Case</Text>
        <Text>Nom : {firstname}</Text>
        <Text>Prénom : {lastname}</Text>
        <Text>email : {email}</Text>
        <Text>Date d'anniversaire : {birthdate}</Text>
      </ScrollView>
    );
  }
}
