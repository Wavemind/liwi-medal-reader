// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';

import PatientList from '../patientsContainer/patientList';

type Props = NavigationScreenProps & {};
type State = {};

// TODO Will be implemented soon
// eslint-disable-next-line react/prefer-stateless-function
export default class MainScreen extends React.Component<Props, State> {

  render(){

    const { navigation } = this.props;

    return (
      <ScrollView>
        <PatientList navigation={navigation} />
      </ScrollView>
    );
  }
}
