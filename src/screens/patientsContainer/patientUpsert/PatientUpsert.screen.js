// @flow

import * as React from 'react';
import { NavigationActions, NavigationScreenProps } from 'react-navigation';
import { ScrollView } from 'react-native';
import { Button, Col, Text, View } from 'native-base';
import * as _ from 'lodash';
import find from 'lodash/find';
import CustomInput from '../../../components/InputContainer/CustomInput/CustomInput';
import { PatientModel } from '../../../../frontend_service/engine/models/Patient.model';
import { MedicalCaseModel } from '../../../../frontend_service/engine/models/MedicalCase.model';
import { LiwiTitle2 } from '../../../template/layout';
import CustomSwitchButton from '../../../components/InputContainer/CustomSwitchButton';

import { styles } from './PatientUpsert.style';
import { getItemFromArray, getItems, getMedicalCase } from '../../../engine/api/LocalStorage';
import LiwiLoader from '../../../utils/LiwiLoader';
import { NodesModel } from '../../../../frontend_service/engine/models/Nodes.model';
import { categories } from '../../../../frontend_service/constants';
import Questions from '../../../components/QuestionsContainer/Questions';

type Props = NavigationScreenProps & {};
type State = {};

export default class PatientUpsert extends React.Component<Props, State> {
  state = {
    errors: {},
    patient: {},
    firstRender: false,
    idLastMedicalCase: null,
    loading: false,
    extraComponents: () => {},
    extraQuestions: {},
    algorithmReady: false,
  };

  /**
   * Get the new extraQuestions and update The questions Component
   */
  updateExtraComponents = async (extraQuestions) => {
    let extraComponents = () => (
      <Questions
        questions={extraQuestions}
        onChange={this.setExtraQuestion}
        method="props"
      />
    );

    await this.setState({
      extraQuestions,
      extraComponents,
    });
  };

  /**
   * Update this question in the component
   *
   * because of immutability we have to flatten it before and change the value
   *
   * @param index [Object] : index of the question in the state
   * @param value [Number || String] : the new value of the question
   *
   */
  setExtraQuestion = async (index, value) => {
    const { extraQuestions } = this.state;

    //Create new object for immmutability
    // Break instance Classe
    let newFlattenObject = {
      ...extraQuestions,
      [index]: { ...extraQuestions[index] },
    };

    // Instance new Classes Nodes
    let nodes = new NodesModel(newFlattenObject);

    // Update the new question changed
    nodes[index].updateAnswer(value);

    await this.updateExtraComponents(nodes);
  };

  async componentWillMount() {
    const { navigation } = this.props;

    let idPatient = navigation.getParam('idPatient');
    if (idPatient === null) {
      let patient = new PatientModel();

      // specific code extra data vaccine etc, shared data
      let algorithms = await getItems('algorithms');

      if (algorithms.length === 0) {
        this.setState({ extraQuestions: [], patient, firstRender: true });
      } else {
        // Get the user algo
        const algorithmUsed = find(algorithms, (a) => a.selected);

        // Instance all nodes for access to filterBy
        let nodes = new NodesModel(algorithmUsed?.nodes);
        // Get nodes needed
        let extraQuestions = nodes?.filterBy(
          [
            {
              by: 'category',
              operator: 'equal',
              value: categories.chronicalCondition,
            },
            {
              by: 'category',
              operator: 'equal',
              value: categories.vaccine,
            },
            {
              by: 'category',
              operator: 'equal',
              value: categories.demographic,
            },
          ],
          'OR',
          'object',
          false
        );

        await this.updateExtraComponents(extraQuestions);

        this.setState({
          patient,
          firstRender: true,
          algorithmReady: true,
        });
      }
    } else {
      await this.getPatient();
    }
  }

  /**
   * Get patient with id in navigation props
   */
  async getPatient() {
    const { navigation } = this.props;
    let id = navigation.getParam('idPatient');

    let patient = await getItemFromArray('patients', 'id', id);
    patient = new PatientModel(patient);

    this.setState({ patient, firstRender: true });
  }

  /**
   * Save patient and redirect to medical case
   */
  saveNewCase = async () => {
    await this.setState({ loading: true });
    const { patient } = this.state;

    let result = await this.savePatient();

    if (result) {
      // Set medicalCase in reducer
      const { setMedicalCase, navigation } = this.props;

      // get state here because set juste before
      const { idLastMedicalCase } = this.state;
      let medicalCase = await getMedicalCase(idLastMedicalCase);
      medicalCase.patient = patient;

      await setMedicalCase(medicalCase);

      navigation.navigate('Triage', {
        title: `${medicalCase.patient.firstname} ${
          medicalCase.patient.lastname
        }`,
      });

      await this.setState({ loading: false });
    }
  };

  /**
   * Update state value of patient
   */
  updatePatientValue = async (key, value) => {
    const { patient } = this.state;
    patient[key] = value;
    await this.setState({ patient });
  };

  /**
   * Save patient and redirect to waiting list
   */
  saveWaitingList = async () => {
    await this.setState({ loading: true });

    const { navigation } = this.props;
    let result = await this.savePatient();

    if (result) {
      navigation.dispatch(NavigationActions.back('patientList'));
    }
    await this.setState({ loading: false });
  };
  /**
   *  Update patient value in storage and redirect to patient profile
   */
  updatePatient = async () => {
    await this.setState({ loading: true });
    const { navigation } = this.props;
    const {
      patient: { id },
    } = this.state;
    await this.savePatient();
    navigation.dispatch(NavigationActions.back('patientProfile', { id }));
    await this.setState({ loading: false });
  };

  /**
   * Generate medical case for current patient
   */
  generateMedicalCase = async (patientId) => {
    const { extraQuestions } = this.state;
    let instanceMedicalCase = new MedicalCaseModel();
    await instanceMedicalCase.create(patientId, extraQuestions);
    return instanceMedicalCase.id;
  };

  /**
   * Set patient in localStorage
   */
  savePatient = async () => {
    const { patient } = this.state;
    const { navigation } = this.props;
    let idPatient = await navigation.getParam('idPatient');

    let errors = await patient.validate();

    // Create patient if there are no errors
    if (_.isEmpty(errors)) {
      await patient.save();

      if (idPatient === null) {
        let id = await this.generateMedicalCase(patient.id);
        await this.setState({ idLastMedicalCase: id });
      }

      return true;
    } else {
      this.setState({ errors: errors });
      return false;
    }
  };

  render() {
    const { updatePatientValue, saveWaitingList, saveNewCase } = this;

    const {
      patient: { firstname, lastname, gender },
      patient,
      errors,
      firstRender,
      loading,
      extraComponents,
      algorithmReady,
    } = this.state;

    const {
      navigation,
      app: { t },
    } = this.props;

    let idPatient = navigation.getParam('idPatient');

    if (!firstRender) {
      return null;
    }

    const hasNoError = !_.isEmpty(patient.validate());

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <LiwiTitle2 noBorder>{t('patient_upsert:title')}</LiwiTitle2>
        <View>
          <Col>
            <CustomInput
              init={firstname}
              label={t('patient:first_name')}
              change={updatePatientValue}
              index="firstname"
              iconName="user"
              iconType="AntDesign"
              error={errors.firstname}
            />
            <CustomInput
              init={lastname}
              label={t('patient:last_name')}
              change={updatePatientValue}
              index="lastname"
              iconName="user"
              iconType="AntDesign"
              error={errors.lastname}
            />
          </Col>
          <Col>
            <CustomSwitchButton
              init={gender}
              label={t('patient:gender')}
              change={updatePatientValue}
              index="gender"
              label1={t('patient:male')}
              label2={t('patient:female')}
              value1="male"
              value2="female"
              iconName="human-male-female"
              iconType="MaterialCommunityIcons"
              error={errors.gender}
            />
          </Col>
          {extraComponents()}
        </View>

        <View bottom-view>
          {algorithmReady ? (
            !loading ? (
              idPatient === null ? (
                <View columns>
                  <Button
                    light
                    split
                    onPress={saveWaitingList}
                    disabled={hasNoError}
                  >
                    <Text>{t('patient_upsert:save_and_wait')}</Text>
                  </Button>
                  <Button
                    success
                    split
                    onPress={saveNewCase}
                    disabled={hasNoError}
                  >
                    <Text>{t('patient_upsert:save_and_case')}</Text>
                  </Button>
                </View>
              ) : (
                <Button success block onPress={this.updatePatient}>
                  <Text>{t('patient_upsert:save')}</Text>
                </Button>
              )
            ) : (
              <LiwiLoader />
            )
          ) : (
            <View columns>
              <Text>{t('work_case:no_algorithm')}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}
