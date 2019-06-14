// @flow

import * as React from 'react';
import { Button, List, ListItem, Text, View } from 'native-base';
import maxBy from 'lodash/maxBy';
import find from 'lodash/find';
import forEach from 'lodash/forEach';

import { styles } from './PatientProfile.style';
import {
  generateInitialBatch,
  setInitialCounter,
} from '../../../../frontend_service/algorithm/algoTreeDiagnosis';
import {
  getItem,
  getItemFromArray,
  getItems,
  setItemFromArray,
} from '../../../engine/api/LocalStorage';
import i18n from '../../../utils/i18n';

import { LiwiTitle2, SeparatorLine } from '../../../template/layout';
import moment from 'moment';

type Props = {};
type State = {};

export default class PatientProfile extends React.Component<Props, State> {
  state = {
    patient: {
      medicalCases: [],
    },
    selected: 'null',
    algorithms: [],
    isGeneratingMedicalCase: false,
  };

  async componentWillMount() {
    await this.getPatient();
  }

  // Get patient data storaged in localstorage
  // Get algo
  async getPatient() {
    const { navigation } = this.props;
    let id = navigation.getParam('id');

    let patient = await getItemFromArray('patients', 'id', id);
    let algorithms = await getItems('algorithms');

    this.setState({ patient, algorithms });
  }

  // Generate new medicalCase with algo selected
  generateMedicalCase = async () => {
    await this.setState({ isGeneratingMedicalCase: true });

    const { algorithms, patient } = this.state;
    const { app } = this.props;
    let patients = await getItem('patients');

    const algorithmUsed = find(algorithms, (a) => a.selected);

    // default counter on each node
    setInitialCounter(algorithmUsed);

    let newMedicalCase = {
      nodes: algorithmUsed.nodes,
      diseases: algorithmUsed.diseases,
      userId: app.user.data.id,
    };

    // initial batch waiting on final workflow
    generateInitialBatch(newMedicalCase);

    let eachMaxId = [];

    // find recursive max id in medicalCases
    forEach(patients, (p) => {
      let itemMax = maxBy(p.medicalCases, 'id');
      if (itemMax !== undefined) {
        eachMaxId.push(itemMax);
      }
    });

    // on each maxBy, take the final maxBy
    let maxId = maxBy(eachMaxId, 'id');

    if (eachMaxId.length === 0) {
      maxId = { id: 0 };
    }

    newMedicalCase.id = maxId.id + 1;
    newMedicalCase.createdDate = moment().format();

    patient.medicalCases.push(newMedicalCase);

    // set in localstorage
    await setItemFromArray('patients', patient, patient.id);

    // Get algo from localstorage (because we modify them)
    await this.getPatient();
    await this.setState({ isGeneratingMedicalCase: false });
  };

  // Select a medical case and redirect to patient's view
  selectMedicalCase = async (medicalCase) => {
    const { setMedicalCase, navigation } = this.props;
    await setMedicalCase(medicalCase);

    navigation.navigate('WorkCase', {
      title: `${medicalCase.patient.firstname} ${medicalCase.patient.lastname}`,
    });
  };

  render() {
    const {
      patient,
      algorithms,
      isGeneratingMedicalCase,
    } = this.state;

    const { navigation } = this.props;

    const flatPatient = {
      ...patient,
    };
    delete flatPatient.medicalCases;

    // Display list of medical cases
    const _renderMedicalCases = patient.medicalCases.map((medicalCase) => {
      const { patient } = this.state;

      return (
        <ListItem
          rounded
          block
          spaced
          onPress={async () => {
            await this.selectMedicalCase({
              ...medicalCase,
              patient: flatPatient,
            });
          }}
        >
          <View w50>
            <Text>{moment(medicalCase.createdDate).format('lll')}</Text>
          </View>
          <View w50>
            <Text>{patient.status}</Text>
          </View>
        </ListItem>
      );
    });

    return (
      <View padding-auto flex>
        <LiwiTitle2 noBorder>
          {patient.firstname} {patient.lastname}
        </LiwiTitle2>
        <Text>
          {moment(patient.birthdate).format('DD/MM/YYYY')} - {patient.gender}
        </Text>
        <Button
          onPress={() =>
            navigation.navigate('PatientEdit', {
              id: patient.id,
            })
          }
        >
          <Text>Edit</Text>
        </Button>
        <SeparatorLine style={styles.bottomMargin}/>
        {algorithms.length > 0 ? (
          <View flex>
            <View>
              {patient.medicalCases.length > 0 ? (
                <List block>{_renderMedicalCases}</List>
              ) : (
                <View padding-auto margin-auto>
                  <Text not-available>
                    {i18n.t('work_case:no_medical_cases')}
                  </Text>
                </View>
              )}
            </View>
            <View bottom-view>
              <Button
                light
                onPress={() => this.generateMedicalCase()}
                disabled={isGeneratingMedicalCase}
              >
                <Text>{i18n.t('work_case:create')}</Text>
              </Button>
            </View>
          </View>
        ) : (
          <View padding-auto margin-auto>
            <Text style={styles.textNotAvailable}>
              {i18n.t('work_case:no_algorithms')}
            </Text>
          </View>
        )}
      </View>
    );
  }
}
