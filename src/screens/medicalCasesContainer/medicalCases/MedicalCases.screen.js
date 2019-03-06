// @flow

import * as React from 'react';
import { Button, H3, Picker, Text } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { ScrollView, View } from 'react-native';
import LottieView from 'lottie-react-native';
import algo from '../../../engine/algorithm/algorithm_versions.json';

import {
  createMedicalCase,
  getItems,
  getUserMedicalCases,
} from '../../../engine/api/LocalStorage';
import moment from 'moment';
import { medicalCaseInitialState } from '../../../engine/algorithm/medicalCase';
import { liwiColors } from '../../../utils/constants';
import { SeparatorLine } from '../../../template/layout';
import find from 'lodash/find';
import {
  setInitialCounter,
  generateInitialBatch,
} from '../../../engine/algorithm/algoTreeDiagnosis';

type Props = NavigationScreenProps & {};

type State = { medicalCases: Array<Object> };

export default class MedicalCases extends React.Component<Props, State> {
  state = { medicalCases: [], algorithmes: [], selected: 'null', versions: [] };

  onValueChange = (value: string) => {
    this.setState({
      selected: value,
    });
  };

  async componentWillMount() {
    await this.getMedicalCases();
    let algorithmes = await getItems('algorithmes');

    let versions = [];
    algorithmes.map((algorithme) =>
      Object.keys(algorithme.versions).map((version) =>
        versions.push(algorithme.versions[version])
      )
    );

    this.setState({ algorithmes, versions });
  }

  getMedicalCases = async () => {
    const { app } = this.props;
    const medicalCases = await getUserMedicalCases(app.user.data.id);
    this.setState({ medicalCases });
  };

  createMedicalCase = async () => {
    const response = await fetch('https://uinames.com/api/?ext&region=france');

    const json = await response.json();

    const versionAlgoSelected = find(
      this.state.versions,
      (a) => a.version === this.state.selected
    );

    let algoWithCounter = setInitialCounter(algo);
    let algoReady = generateInitialBatch(algoWithCounter);

    await createMedicalCase({
      ...medicalCaseInitialState,
      ...algoReady,
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


    const { medicalCases, versions, selected } = this.state;
    const { setMedicalCase, navigation, medicalCase } = this.props;

    const _renderMedicalCases = this.state.medicalCases.map((mc, index) => {
      return (
        <Button
          key={mc.id + '_medicalCase'}
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
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <LottieView
            source={require('../../../utils/animations/blood_1.json')}
            autoPlay
            style={{
              height: 100,
            }}
            loop
          />
        </View>
        <H3>Actions</H3>
        <Button
          onPress={() => this.createMedicalCase()}
          // disabled={selected === 'null'}
        >
          <Text>Créer un cas médical</Text>
        </Button>
        <Picker
          mode="dropdown"
          iosHeader="Select your medical case"
          style={{
            backgroundColor: liwiColors.redColor,
            margin: 5,
            color: liwiColors.whiteColor,
          }}
          selectedValue={selected}
          onValueChange={this.onValueChange}
        >
          <Picker.Item label="Choisir l'algorithme" value="null" />
          {versions.map((v) => (
            <Picker.Item label={v.version} value={v.version} />
          ))}
        </Picker>
        <SeparatorLine />
        <H3>Cas médicals</H3>
        {_renderMedicalCases}
      </ScrollView>
    );
  }
}
