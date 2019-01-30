// @flow

import * as React from 'react';
import { Button, Text } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { ScrollView } from 'react-native';
import { getUserMedicaleCases } from '../../engine/api/LocalStorage';
import moment from 'moment';

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
    const { app } = this.props;
    app.createMedicalCase();
    await this.getMedicalCases();
  };

  render() {
    const { medicalCases } = this.state;
    const { app, clear, setMedicalCase, navigation } = this.props;

    return (
      <ScrollView>
        <Text>Medical Cases</Text>
        <Button onPress={() => this.createMedicalCase()}>
          <Text>Créer un cas médical</Text>
        </Button>
        <Button onPress={() => clear()}>
          <Text>Clear MedicalCase Store Redux</Text>
        </Button>
        {medicalCases.map((medicalCase) => (
          <Button
            onPress={async () => {
              await setMedicalCase(medicalCase);
              // await app.setMedicalCase(medicalCase); // TODO find better way
              navigation.navigate('MedicalCase', {
                title: `${medicalCase.patient.firstname} ${
                  medicalCase.patient.lastname
                }`,
              });
            }}
          >
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
