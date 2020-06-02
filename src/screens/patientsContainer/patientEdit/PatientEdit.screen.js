// @flow

import * as React from 'react';
import { Button, Col, Icon, Input, Item, Text, View } from 'native-base';
import _ from 'lodash';

import { styles } from './PatientEdit.style';
import { LiwiTitle2 } from '../../../template/layout';
import { ScrollView } from 'react-native';
import LiwiLoader from '../../../utils/LiwiLoader';
import Questions from '../../../components/QuestionsContainer/Questions';
import { getItems } from '../../../engine/api/LocalStorage';

export default class PatientEdit extends React.Component {
  state = {
    patient: null,
    loading: true,
   };

  getQuestionFromPatient = async (patient) => {
    const algorithm = await getItems('algorithm');

    return patient.patientValues.map((patientValue) => {
      return algorithm.nodes[patientValue.node_id];
    });
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
      patientValues,
      loading: false,
    });
  }

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
            <Text customSubTitle>{t('patient_upsert:questions')}</Text>
            <Questions questions={patientValues} patientValueEdit />
          </>
        )}
      </ScrollView>
    );
  }
}
