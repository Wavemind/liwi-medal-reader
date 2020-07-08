// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import { Button, Text, View } from 'native-base';
import { filter, find } from 'lodash';

import { styles } from './PatientEdit.style';
import { LiwiTitle2 } from '../../../template/layout';
import LiwiLoader from '../../../utils/LiwiLoader';
import Questions from '../../../components/QuestionsContainer/Questions';
import { getItem, getItems } from '../../../engine/api/LocalStorage';
import { ActivityModel } from '../../../../frontend_service/engine/models/Activity.model';
import { categories } from '../../../../frontend_service/constants';
import { PatientValueModel } from '../../../../frontend_service/engine/models/PatientValue.model';
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
    const algorithm = await getItems('algorithm');
    const currentPatient = navigation.getParam('patient');
    const patient = convertToObject(currentPatient);

    setPatient(patient, algorithm);

    this.setState({
      algorithm,
      patient,
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
      app: { isActionAvailable, t, database },
    } = this.props;

    if (isActionAvailable()) {
      this.setState({ disable: true });
      const user = await getItem('user');

      // Gets all the patient values that need to be stored in the database
      // meaning remove empty ones
      const newPatientValues = PatientValueModel.getUpdatedPatientValue(patient);
      const activities = await new ActivityModel({ nodes: newPatientValues, stage: 'PatientEdit', user });

      await database.update('Patient', patient.id, { patientValues: newPatientValues, activities });

      navigation.navigate('PatientProfile', {
        id: patient.id,
        refresh: true,
      });
    } else {
      displayNotification(t('application:resource_not_available'), liwiColors.redColor);
      navigation.navigate('Home');
    }
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
          <LiwiTitle2 noBorder>{t('patient_upsert:title')}</LiwiTitle2>
          {loading ? <LiwiLoader /> : <Questions questions={nodes} patientValueEdit />}
        </ScrollView>
        <View style={styles.flexRow}>
          <Button block onPress={() => NavigationService.navigate('ConsentPreview')}>
            <Text style={{ flex: 1, textAlign: 'center' }}>Show consent file</Text>
          </Button>
        </View>
        <View bottom-view>
          <Button block onPress={() => this.savePatientValues()} disabled={disable}>
            <Text size-auto>{t('application:save')}</Text>
          </Button>
        </View>
      </>
    );
  }
}
