// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import { Button, Text, View } from 'native-base';
import { filter, find } from 'lodash';

import { styles } from './PatientEdit.style';
import { LiwiTitle2 } from '../../../template/layout';
import LiwiLoader from '../../../utils/LiwiLoader';
import Questions from '../../../components/QuestionsContainer/Questions';
import { getItem } from '../../../engine/api/LocalStorage';
import { ActivityModel } from '../../../../frontend_service/helpers/Activity.model';
import { categories } from '../../../../frontend_service/constants';
import { PatientValueModel } from '../../../../frontend_service/helpers/PatientValue.model';
import { convertToObject } from '../../../utils/swissKnives';

import { store } from '../../../../frontend_service/store';
import { displayNotification } from '../../../utils/CustomToast';
import { liwiColors } from '../../../utils/constants';
import NavigationService from '../../../engine/navigation/Navigation.service';

export default class PatientEdit extends React.Component {
  state = {
    patient: null,
    loading: true,
    disable: false,
  };

  async componentDidMount() {
    const { navigation, setPatient } = this.props;
    const algorithm = await getItem('algorithm');
    const currentPatient = navigation.getParam('patient');
    const patient = convertToObject(JSON.parse(JSON.stringify({ ...currentPatient, medicalCases: [] })));

    setPatient(patient, algorithm);

    this.setState({
      algorithm,
      patient: currentPatient,
      loading: false,
    });
  }

  getQuestionFromPatient = () => {
    const { algorithm } = this.state;
    if (algorithm !== undefined) {
      const state$ = store.getState();

      const patientValuesQuestions = filter(algorithm.nodes, (node) => [categories.demographic, categories.basicDemographic].includes(node.category));
      return patientValuesQuestions.map((question) => {
        const patientValues = find(state$.patientValues, ['node_id', question.id]);

        return {
          ...question,
          answer: patientValues === undefined ? null : patientValues.answer_id,
          value: patientValues === undefined ? null : patientValues.value,
        };
      });
    }
    return [];
  };

  /**
   * Save Patient Values in database and redirects to Patient profile
   * @returns null
   */
  savePatientValues = async () => {
    const { patient } = this.state;
    const {
      navigation,
      app: { t, database, session: {facility}},
    } = this.props;

    this.setState({ disable: true });
    const user = await getItem('user');

    // Gets all the patient values that need to be stored in the database
    // meaning remove empty ones
    const newPatientValues = PatientValueModel.getUpdatedPatientValue(patient);

    const activities = await new ActivityModel({ nodes: newPatientValues, stage: 'PatientEdit', user });

    if (facility.architecture === 'client_server') {
      await database.update('Patient', patient.id, { patientValues: newPatientValues, activities });
    } else {
      newPatientValues.forEach(async (patientValue) => {
        await database.update('PatientValue', patientValue.id, { ...patientValue, activities });
      });
    }

    navigation.navigate('PatientProfile', {
      id: patient.id,
      refresh: true,
    });
  };

  render() {
    const { loading, disable } = this.state;
    const {
      app: { t },
    } = this.props;

    const nodes = this.getQuestionFromPatient();
    return (
      <>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="always">
          <View style={styles.flexRow}>
            <View style={styles.flex05}>
              <LiwiTitle2 noBorder>{t('patient_upsert:title')}</LiwiTitle2>
            </View>
            <View style={styles.flex05}>
              <Button onPress={() => NavigationService.navigate('ConsentPreview')}>
                <Text style={styles.flexCenter}>{t('patient_edit:show_consent')}</Text>
              </Button>
            </View>
          </View>

          {loading ? <LiwiLoader /> : <Questions questions={nodes} patientValueEdit />}
        </ScrollView>
        <View bottom-view>
          <Button block onPress={() => this.savePatientValues()} disabled={disable}>
            <Text size-auto>{t('application:save')}</Text>
          </Button>
        </View>
      </>
    );
  }
}
