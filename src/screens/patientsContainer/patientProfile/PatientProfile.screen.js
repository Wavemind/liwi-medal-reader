// @flow

import * as React from 'react';
import { List, ListItem, Text, View, Button } from 'native-base';
import maxBy from 'lodash/maxBy';
import find from 'lodash/find';

import { styles } from './PatientProfile.style';
import { generateInitialBatch, setInitialCounter } from '../../../../frontend_service/algorithm/algoTreeDiagnosis';
import { getItemFromArray, getItems, setItemFromArray } from '../../../engine/api/LocalStorage';
import i18n from '../../../utils/i18n';

import { LiwiTitle2, SeparatorLine } from '../../../template/layout';
import moment from "moment";

type Props = {};
type State = {};

export default class PatientProfile extends React.Component<Props, State> {
  state = {
    patient: {
      medicalCases: [],
    },
    selected: 'null',
    algorithms: [],
    generate: false,
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
    const { app } = this.props;

    const algorithmUsed = find(algorithms, (a) => a.selected);
    setInitialCounter(algorithmUsed);

    let newMedicalCase = {
      nodes: algorithmUsed.nodes,
      diseases: algorithmUsed.diseases,
      userId: app.user.data.id,
    };

    generateInitialBatch(newMedicalCase);
    let maxId = maxBy(patient.medicalCases, 'id');

    if (patient.medicalCases.length === 0) {
      maxId = { id: 0 };
    }

    newMedicalCase.id = maxId.id + 1;
    newMedicalCase.createdDate = moment().format();

    patient.medicalCases.push(newMedicalCase);

    await setItemFromArray('patients', patient, patient.id);
    await this.getPatientAlgo();
    await this.setState({ generate: false });
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
    const { patient, algorithms } = this.state;

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
            <Text>
              {moment(medicalCase.createdDate).format('lll')}
            </Text>
          </View>
          <View w50>
            <Text>{patient.status}</Text>
          </View>
        </ListItem>
      );
    });


    return (
      <View padding-auto flex>
        <LiwiTitle2 noBorder>{patient.firstname} {patient.lastname}</LiwiTitle2>
        <SeparatorLine style={styles.bottomMargin}/>
        {algorithms.length > 0 ? (
          <View flex>
            <View>
              {
                patient.medicalCases.length > 0 ?
                  <List block>
                    {_renderMedicalCases}
                  </List> : (
                    <View padding-auto margin-auto>
                      <Text style={styles.textNotAvailable}>{i18n.t('work_case:no_medical_cases')}</Text>
                    </View>
                  )
              }
            </View>
            <View bottom-view>
              <Button
                light
                onPress={() => this.generateMedicalCase()}
              >
                <Text>{i18n.t('work_case:create')}</Text>
              </Button>
            </View>
          </View>
        ) : (
          <View padding-auto margin-auto>
            <Text not-available>{i18n.t('work_case:no_algorithms')}</Text>
          </View>
        )}
      </View>
    );
  }
}
