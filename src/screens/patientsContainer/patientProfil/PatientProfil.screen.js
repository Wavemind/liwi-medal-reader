// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import { Button, H3, Text, View } from 'native-base';

import { styles } from './PatientProfil.style';
import { SeparatorLine } from '../../../template/layout';
import {
  getItemFromArray,
  getItems,
  setItemFromArray,
} from '../../../engine/api/LocalStorage';
import find from 'lodash/find';
import {
  generateInitialBatch,
  setInitialCounter,
} from '../../../../frontend_service/algorithm/algoTreeDiagnosis';
import LottieView from 'lottie-react-native';
import i18n from '../../../utils/i18n';
import maxBy from 'lodash/maxBy';

type Props = {};
type State = {};

export default class PatientProfil extends React.Component<Props, State> {
  state = {
    patient: {
      medicalCases: [],
    },
    selected: 'null',
    generate: false,
    algorithms: [],
  };

  async getPatientAlgo() {
    const { navigation } = this.props;
    let id = navigation.getParam('id');

    let patient = await getItemFromArray('patients', 'id', id);
    let algorithms = await getItems('algorithms');

    this.setState({ patient, algorithms });
  }

  async componentWillMount() {
    await this.getPatientAlgo();
  }

  generateMedicalCase = async () => {
    const { algorithms, patient } = this.state;

    const algorithmUsed = find(algorithms, (a) => a.selected);

    setInitialCounter(algorithmUsed);

    let newMedicalCase = {
      nodes: algorithmUsed.nodes,
      diseases: algorithmUsed.diseases,
      userId: this.props.app.user.data.id,
    };

    generateInitialBatch(newMedicalCase);

    let maxId = maxBy(patient.medicalCases, 'id');

    if (patient.medicalCases.length === 0) {
      maxId = { id: 0 };
    }

    newMedicalCase.id = maxId.id + 1;

    patient.medicalCases.push(newMedicalCase);

    await setItemFromArray('patients', patient, patient.id);
    await this.getPatientAlgo();
    await this.setState({ generate: false });
  };

  // Select a medical case and redirect to patient's view
  selectMedicalCase = async (medicalCase) => {
    const { setMedicalCase, navigation } = this.props;

    await setMedicalCase(medicalCase);
    // await app.setMedicalCase(medicalCase); // TODO find better way
    await this.getMedicalCases();
    navigation.navigate('WorkCase', {
      title: `${medicalCase.patient.firstname} ${medicalCase.patient.lastname}`,
    });
  };

  render() {
    const { navigation } = this.props;
    const { generate, algorithms, patient } = this.state;

    const flatPatient = {
      ...patient,
    };
    delete flatPatient.medicalCases;

    const _renderMedicalCases = this.state.patient.medicalCases.map((mc) => {
      return (
        <Button
          key={mc.id + '_medicalCase'}
          disabled={false}
          onPress={async () => {
            await this.selectMedicalCase({
              ...mc,
              patient: flatPatient
            });
          }}
        >
          <Text>medicalCase id :{mc.id}</Text>
        </Button>
      );
    });

    return (
      <ScrollView>
        <View padding-auto>
          <Text>
            {this.state.firstname} - {this.state.lastname}
          </Text>
        </View>
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
          ) : (
            <LottieView
              source={require('../../../utils/animations/blood_1.json')}
              autoPlay
              style={styles.height}
              loop
            />
          )}
        </View>
        <H3>Actions</H3>
        {algorithms.length > 0 ? (
          <Button
            onPress={() => this.generateMedicalCase()}
            disabled={generate}
          >
            <Text>{i18n.t('workcase:button_create')}</Text>
          </Button>
        ) : (
          <Button disabled={true}>
            <Text>{i18n.t('workcase:none')}</Text>
          </Button>
        )}
        <SeparatorLine />
        <H3>{i18n.t('workcase:case_medical')}</H3>
        {_renderMedicalCases}
      </ScrollView>
    );
  }
}
