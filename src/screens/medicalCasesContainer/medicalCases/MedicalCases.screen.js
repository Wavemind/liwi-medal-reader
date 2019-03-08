// @flow

import * as React from 'react';
import moment from 'moment';
import { medicalCaseInitialState } from '../../../../frontend_service/engine/algorithm/medicalCase';
import { SeparatorLine } from '../../../template/layout';
import { styles } from './MedicalCases.style';
import { NavigationScreenProps } from 'react-navigation';
import LottieView from 'lottie-react-native';
import algorithmJson from '../../../../frontend_service/engine/algorithm/algorithm_versions.json';
import {
  Button,
  H3,
  Picker,
  Text,
} from 'native-base';
import {
  ScrollView,
  View,
} from 'react-native';
import {
  createMedicalCase,
  getItems,
  getUserMedicalCases,
} from '../../../engine/api/LocalStorage';
import {
  setInitialCounter,
  generateInitialBatch,
} from '../../../../frontend_service/engine/algorithm/algoTreeDiagnosis';

type Props = NavigationScreenProps & {};
type State = { medicalCases: Array<Object> };

export default class MedicalCases extends React.Component<Props, State> {
  state = {
    medicalCases: [],
    algorithms: [],
    selected: 'null',
    versions: [],
  };

  async componentWillMount() {
    await this.getMedicalCases();
    let algorithms = await getItems('algorithms');

    let versions = [];
    algorithms.map((algorithm) =>
      Object.keys(algorithm.versions).map((version) =>
        versions.push(algorithm.versions[version]),
      ),
    );

    this.setState({ algorithms, versions });
  }

  // Update value
  onValueChange = (value: string) => {
    this.setState({
      selected: value,
    });
  };

  // Get medical cases of current user
  getMedicalCases = async () => {
    const { app } = this.props;
    const medicalCases = await getUserMedicalCases(app.user.data.id);
    this.setState({ medicalCases });
  };

  // Create new medical case
  generateMedicalCase = async () => {
    const response = await fetch('https://uinames.com/api/?ext&region=france');

    const json = await response.json();

    let algorithm = setInitialCounter(algorithmJson);
    let algorithmFirstBatch = generateInitialBatch(algorithm);

    await createMedicalCase({
      ...medicalCaseInitialState,
      ...algorithmFirstBatch,
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

  // Select a medical case and redirect to patient's view
  selectMedicalCase = async (medicalCase) => {
    const { setMedicalCase, navigation } = this.props;
    await setMedicalCase(medicalCase);
    // await app.setMedicalCase(medicalCase); // TODO find better way
    await this.getMedicalCases();
    navigation.navigate('MedicalCase', {
      title: `Cas médical : ${medicalCase.id}`,
    });
  };

  render() {
    const {
      versions,
      selected,
    } = this.state;

    const { medicalCase } = this.props;

    const _renderMedicalCases = this.state.medicalCases.map((mc) => {
      return (
        <Button
          key={mc.id + '_medicalCase'}
          disabled={medicalCase.id === mc.id}
          onPress={() => {
            this.selectMedicalCase(mc);
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
          style={styles.view}>
          <LottieView
            source={require('../../../utils/animations/blood_1.json')}
            autoPlay
            style={styles.height}
            loop
          />
        </View>
        <H3>Actions</H3>
        <Button
          onPress={() => this.generateMedicalCase()}
          // disabled={selected === 'null'}
        >
          <Text>Créer un cas médical</Text>
        </Button>
        <Picker
          mode="dropdown"
          iosHeader="Select your medical case"
          style={styles.picker}
          selectedValue={selected}
          onValueChange={this.onValueChange}
        >
          <Picker.Item label="Choisir l'algorithme" value="null"/>
          {versions.map((v) => (
            <Picker.Item label={v.version} value={v.version}/>
          ))}
        </Picker>
        <SeparatorLine/>
        <H3>Cas médicals</H3>
        {_renderMedicalCases}
      </ScrollView>
    );
  }
}
