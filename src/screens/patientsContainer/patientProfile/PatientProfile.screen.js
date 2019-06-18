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
import LiwiLoader from '../../../utils/LiwiLoader';
import { MedicalCaseModel } from '../../../../frontend_service/engine/models/MedicalCase.model';

type Props = {};
type State = {};

export default class PatientProfile extends React.Component<Props, State> {
  state = {
    patient: {
      birthdate: '01/01/1900',
      medicalCases: [],
    },
    selected: 'null',
    algorithms: [],
    isGeneratingMedicalCase: false,
    firstRender: false,
  };

  async componentWillMount() {
    this.props.navigation.addListener('willFocus', async () => {
      await this.getPatient();
    });
  }

  // Get patient data storaged in localstorage
  async getPatient() {
    const { navigation } = this.props;
    let id = navigation.getParam('id');

    let patient = await getItemFromArray('patients', 'id', id);
    let algorithms = await getItems('algorithms');

    console.log(patient);

    this.setState({
      patient,
      algorithms,
      firstRender: true,
    });
  }

  // Generate new medicalCase with algo selected
  generateMedicalCase = async () => {
    await this.setState({ isGeneratingMedicalCase: true });
    let instanceMedicalCase = new MedicalCaseModel();
    await instanceMedicalCase.createMedicalCase(this.state.patient.id)
    await this.getPatient();
    await this.setState({ isGeneratingMedicalCase: false });
    return false;
  };

  // Select a medical case and redirect to patient's view
  selectMedicalCase = async (medicalCase) => {
    const { setMedicalCase, navigation } = this.props;
    await setMedicalCase(medicalCase);

    navigation.navigate('Triage', {
      title: `${medicalCase.patient.firstname} ${medicalCase.patient.lastname}`,
    });
  };

  render() {
    const {
      patient,
      algorithms,
      isGeneratingMedicalCase,
      firstRender,
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

    return !firstRender ? (
      <LiwiLoader />
    ) : (
      <View padding-auto flex>
        <LiwiTitle2 noBorder>
          {patient.firstname} {patient.lastname}
        </LiwiTitle2>
        <Text>
          {moment(patient.birthdate).format('d MMMM YYYY')} - {patient.gender}
        </Text>
        <Button
          onPress={() =>
            navigation.navigate('PatientNew', {
              idPatient: patient.id,
            })
          }
        >
          <Text>Edit</Text>
        </Button>
        <SeparatorLine style={styles.bottomMargin} />
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
            <Text>{i18n.t('work_case:no_algorithms')}</Text>
          </View>
        )}
      </View>
    );
  }
}
