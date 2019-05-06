// @flow

import * as React from 'react';
import moment from 'moment';
import { medicalCaseInitialState } from '../../../../frontend_service/algorithm/medicalCase';
import { SeparatorLine } from '../../../template/layout';
import { styles } from './MedicalCases.style';
import { NavigationScreenProps } from 'react-navigation';
import LottieView from 'lottie-react-native';
import { Button, H3, Text } from 'native-base';
import { ScrollView, View } from 'react-native';
import find from 'lodash/find';
import { createMedicalCase, getItems, getUserMedicalCases } from '../../../engine/api/LocalStorage';
import {
  generateInitialBatch,
  setInitialCounter,
} from '../../../../frontend_service/algorithm/algoTreeDiagnosis';

type Props = NavigationScreenProps & {};
type State = { medicalCases: Array<Object> };

export default class MedicalCases extends React.Component<Props, State> {
  state = {
    medicalCases: [],
    algorithms: [],
    selected: 'null',
    versions: [],
    generate: null,
  };

  async componentWillMount() {
    await this.getMedicalCases();
    let algorithms = await getItems('algorithms');

    let versions = [];
    algorithms.map((algorithm) =>
      Object.keys(algorithm.versions).map((version) =>
        versions.push(algorithm.versions[version])
      )
    );

    this.setState({ algorithms, versions });
  }

  // Get medical cases of current user
  getMedicalCases = async () => {
    const { app } = this.props;
    const medicalCases = await getUserMedicalCases(app.user.data.id);
    this.setState({ medicalCases });
  };

  // Create new medical case
  generateMedicalCase = async () => {
    await this.setState({ generate: true });
    this.loading.play();
    const response = await fetch('https://uinames.com/api/?ext&region=france');

    const json = await response.json();

    const algorithms = await getItems('algorithms');

    const algorithmUsed = find(algorithms, (a) => a.selected);

    let algorithm = setInitialCounter(algorithmUsed);

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
    await this.setState({ generate: false });
    this.loading.reset();
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
    const { generate } = this.state;

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
        <View style={styles.view}>
          {generate === true ? (
            <LottieView
              ref={(loading) => {
                this.loading = loading;
              }}
              speed={3}
              source={require('../../../utils/animations/loading.json')}
              style={styles.height}
              loop
            />
          ) :  <LottieView
            source={require('../../../utils/animations/blood_1.json')}
            autoPlay
            style={styles.height}
            loop
          />}
        </View>
        <H3>Actions</H3>
        <Button onPress={() => this.generateMedicalCase()} disabled={generate}>
          <Text>Créer un cas médical</Text>
        </Button>

        <SeparatorLine />
        <H3>Cas médicals</H3>
        {_renderMedicalCases}
      </ScrollView>
    );
  }
}
