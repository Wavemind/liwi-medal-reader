// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import { Button, Text, View } from 'native-base';
import { isString, isArrayLike, filter, find } from 'lodash';

import { styles } from './PatientEdit.style';
import { LiwiTitle2 } from '../../../template/layout';
import LiwiLoader from '../../../utils/LiwiLoader';
import Questions from '../../../components/QuestionsContainer/Questions';
import { getItem, getItems } from '../../../engine/api/LocalStorage';
import { ActivityModel } from '../../../../frontend_service/engine/models/Activity.model';
import { categories } from '../../../../frontend_service/constants';
import { PatientValueModel } from '../../../../frontend_service/engine/models/PatientValue.model';

import { store } from '../../../../frontend_service/store';

const convertToObject = (realmObject, maxDepth = 3, depth = 0) => {
  depth++;
  if (depth > maxDepth) {
    return realmObject;
  }

  if (typeof realmObject !== 'object') {
    return realmObject;
  }

  if (realmObject === null) {
    return null;
  }

  let keys = Object.getOwnPropertyDescriptors(realmObject);

  if (typeof realmObject.objectSchema === 'function') {
    keys = realmObject.objectSchema().properties;
  }

  const object = {};

  for (const key in keys) {
    if (realmObject.hasOwnProperty(key)) {
      // We don't follow linkinh objects
      if (keys[key].type === 'linkingObjects') {
        object[key] = realmObject[key];
      } else if (isString(realmObject[key])) {
        object[key] = realmObject[key];
      } else if (isArrayLike(realmObject[key]) && !isString(realmObject[key])) {
        object[key] = realmObject[key].map((item) => convertToObject(item, maxDepth, depth, key));
      } else {
        object[key] = convertToObject(realmObject[key], maxDepth, depth, key);
      }
    }
  }
  return object;
};

export default class PatientEdit extends React.Component {
  state = {
    patient: null,
    loading: true,
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
    } else {
      return [];
    }
  };

  savePatientValues = async () => {
    const { patient } = this.state;

    const user = await getItem('user');
    const {
      app: { database },
    } = this.props;

    const newPatientValues = PatientValueModel.generatePatientValue(patient);
    const activities = await new ActivityModel({ nodes: newPatientValues, stage: 'PatientEdit', user });

    await database.update('Patient', patient.id, { patientValues: newPatientValues, activities });
  };

  render() {
    const { loading } = this.state;
    const {
      app: { t },
    } = this.props;
    const nodes = this.getQuestionFromPatient();
    return (
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="always">
        <LiwiTitle2 noBorder>{t('patient_upsert:title')}</LiwiTitle2>
        {loading ? (
          <LiwiLoader />
        ) : (
          <>
            <Questions questions={nodes} patientValueEdit />
            <View bottom-view>
              <View columns>
                <Button success split onPress={() => this.savePatientValues()}>
                  <Text>{t('application:save')}</Text>
                </Button>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    );
  }
}
