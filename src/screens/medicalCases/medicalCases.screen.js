// @flow

import * as React from 'react';
import {
  Button,
  Form,
  Input,
  Item,
  Label,
  Text,
  View,
  Spinner,
} from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { ScrollView } from 'react-native';
import { getUserMedicaleCases } from '../../engine/api/LocalStorage';
import moment from 'moment';

type Props = NavigationScreenProps & {};

type State = {};

export default class MedicalCases extends React.Component<Props, State> {
  state = { medicalCases: [] };

  componentWillMount() {
    this.createMedicalCase();
    this.props.addTodo('yeah');
  }

  createMedicalCase = async () => {
    const { app } = this.props;
    app.createMedicalCase();
    const medicalCases = await getUserMedicaleCases(app.user.data.id);
    this.setState({ medicalCases });
  };

  render() {
    const { medicalCases } = this.state;
    const { app } = this.props;

    console.log(this.props);

    return (
      <ScrollView>
        <Text>Medical Cases</Text>
        <Button onPress={() => this.createMedicalCase()}>
          <Text>Créer un cas médical</Text>
        </Button>
        {medicalCases.map((medicalCase) => (
          <Button onPress={() => {}}>
            <Text>
              {medicalCase.id} - {medicalCase.patient.firstname}{' '}
              {medicalCase.patient.lastname} -{' '}
              {moment(medicalCase.createdDate).format('lll')}
            </Text>
          </Button>
        ))}
      </ScrollView>
    );
  }
}
