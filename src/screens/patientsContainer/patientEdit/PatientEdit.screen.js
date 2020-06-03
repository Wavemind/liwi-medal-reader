// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import { Button, Text, View } from 'native-base';

import { differenceNodes } from '../../../utils/swissKnives';
import { store } from '../../../../frontend_service/store';
import { styles } from './PatientEdit.style';
import { LiwiTitle2 } from '../../../template/layout';
import LiwiLoader from '../../../utils/LiwiLoader';
import Questions from '../../../components/QuestionsContainer/Questions';
import { getItem, getItems } from '../../../engine/api/LocalStorage';
import { ActivityModel } from '../../../../frontend_service/engine/models/Activity.model';

export default class PatientEdit extends React.Component {
  state = {
    patient: null,
    loading: true,
   };

  async componentDidMount() {
    const {
      navigation,
      setPatient,
      app: { database },
    } = this.props;
    const algorithm = await getItems('algorithm');
    const patientId = navigation.getParam('idPatient');
    const patient = await database.findBy('Patient', patientId);
    const patientValues = await this.getQuestionFromPatient(patient);

    setPatient(patient, algorithm);

    this.setState({
      patient,
      patientValues,
      loading: false,
    });
  }

  getQuestionFromPatient = async (patient) => {
    const algorithm = await getItems('algorithm');

    return patient.patientValues.map((patientValue) => {
      return algorithm.nodes[patientValue.node_id];
    });
  };

  savePatientValues = async () => {
    const { patient } = this.state;
    const state = store.getState();
    const user = await getItem('user');
    const {
      app: { database },
    } = this.props;

    const newPatientValue = differenceNodes(state.patientValues, patient.patientValues, 'answer_id', 'node_id');
    const activities = await new ActivityModel({ nodes: newPatientValue,
      stage: 'PatientEdit', user });

    console.log({ patientValues: newPatientValue, activities });
    console.log(newPatientValue);
    database.update('Patient', patient.id, { patientValues: newPatientValue, activities });
  };

  render() {
    const { loading, patientValues } = this.state;
    const {
      app: { t },
    } = this.props;

    return (
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="always">
        <LiwiTitle2 noBorder>{t('patient_upsert:title')}</LiwiTitle2>
        {loading ? (
          <LiwiLoader />
        ) : (
          <>
            <Questions questions={patientValues} patientValueEdit />
            <View bottom-view>
              <View columns>
                <Button success split onPress={() => this.savePatientValues()}>
                  <Text>{t('patient_upsert:save_and_case')}</Text>
                </Button>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    );
  }
}
