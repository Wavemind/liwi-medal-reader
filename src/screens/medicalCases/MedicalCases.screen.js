// @flow

import * as React from 'react';
import { Button, Text } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { ScrollView } from 'react-native';
import {
  createMedicalCase,
  getUserMedicaleCases,
} from '../../engine/api/LocalStorage';
import moment from 'moment';
import { medicalCaseInitialState } from '../../engine/algorithme/medicalCase';

type Props = NavigationScreenProps & {};

type State = { medicalCases: Array<Object> };

export default class MedicalCases extends React.Component<Props, State> {
  state = { medicalCases: [] };

  async componentWillMount() {
    await this.getMedicalCases();
  }

  getMedicalCases = async () => {
    const { app } = this.props;
    const medicalCases = await getUserMedicaleCases(app.user.data.id);
    this.setState({ medicalCases });
  };

  createMedicalCase = async () => {
    const response = await fetch('https://uinames.com/api/?ext&region=france');

    const json = await response.json();

    await createMedicalCase({
      ...medicalCaseInitialState,
      userId: this.props.app.user.data.id,
      patient: {
        ...medicalCaseInitialState.patient,
        lastname: json.name,
        firstname: json.surname,
        birthdate: json.birthday.dmy,
        email: json.email,
        photo: json.photo,
      },
    });
    await this.getMedicalCases();
  };

  onSelectMedicalCase = async (mc) => {
    const { setMedicalCase, navigation, medicalCase } = this.props;
    await setMedicalCase(mc);
    // await app.setMedicalCase(medicalCase); // TODO find better way
    await this.getMedicalCases();
    navigation.navigate('MedicalCase', {
      title: `Cas médical : ${mc.id}`,
    });
  };

  render() {
    const { medicalCases } = this.state;
    const { setMedicalCase, navigation, medicalCase } = this.props;

    const _renderMedicalCases = this.state.medicalCases.map((mc, index) => {
      return (
        <Button
          disabled={medicalCase.id === mc.id}
          onPress={() => {
            this.onSelectMedicalCase(mc);
          }}
        >
          <Text>
            {mc.id} - {mc.patient.firstname} {mc.patient.lastname} -{' '}
            {moment(mc.createdDate).format('lll')}
          </Text>
        </Button>
      );
    });

    return (
      <ScrollView>
        <Text>Medical Cases</Text>
        <Button onPress={() => this.createMedicalCase()}>
          <Text>Créer un cas médical</Text>
        </Button>
        {_renderMedicalCases}
      </ScrollView>
    );
  }
}
