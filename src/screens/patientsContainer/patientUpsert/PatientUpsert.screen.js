// @flow

import * as React from 'react';
import { NavigationActions, NavigationScreenProps } from 'react-navigation';
import { ScrollView } from 'react-native';
import { Button, Col, Text, View } from 'native-base';
import * as _ from 'lodash';
import CustomInput from '../../../components/InputContainer/CustomInput/CustomInput';
import { PatientModel } from '../../../../frontend_service/engine/models/Patient.model';
import { MedicalCaseModel } from '../../../../frontend_service/engine/models/MedicalCase.model';
import { LiwiTitle2 } from '../../../template/layout';
import CustomSwitchButton from '../../../components/InputContainer/CustomSwitchButton';

import { styles } from './PatientUpsert.style';
import { getItemFromArray, getItems, getMedicalCase } from '../../../engine/api/LocalStorage';
import LiwiLoader from '../../../utils/LiwiLoader';
import { categories } from '../../../../frontend_service/constants';
import Questions from '../../../components/QuestionsContainer/Questions';

type Props = NavigationScreenProps & {};
type State = {};

export default class PatientUpsert extends React.Component<Props, State> {
  state = {
    errors: {},
    patient: {},
    firstRender: false,
    medicalCaseId: null,
    loading: false,
    extraComponents: () => {
    },
    extraQuestions: {},
    algorithmReady: false,
  };

  /**
   * Get the new extraQuestions and update The questions Component
   */
  initExtraComponents = async (extraQuestions) => {
    let extraComponents = () => (
      <Questions questions={extraQuestions} />
    );

    await this.setState({
      extraQuestions,
      extraComponents,
    });
  };

  async componentWillMount() {
    const { navigation, setMedicalCase } = this.props;
    let patient = {};
    let patientId = navigation.getParam('idPatient');

    if (patientId === null) {
      patient = new PatientModel();
      let algorithms = await getItems('algorithms');

      if (algorithms.length === 0) {
        this.setState({ extraQuestions: [], patient, firstRender: true });
      } else {

        // Generate medical case
        let medicalCase = await this.generateMedicalCase(patient);
        medicalCase.patient = patient;

        await setMedicalCase(medicalCase);

        // Instance all nodes for access to filterBy
        let extraQuestions = medicalCase.nodes.filterBy(
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

        await this.initExtraComponents(extraQuestions);

        this.setState({
          patient,
          firstRender: true,
          algorithmReady: true,
        });
      }
    } else {
      patient = await this.getPatient();
      await this.generateMedicalCase(patient);
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
    return patient;
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

      // Get state here because set just before
      const { medicalCaseId } = this.state;
      let medicalCase = await getMedicalCase(medicalCaseId);
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
  generateMedicalCase = async (patient) => {
    let instanceMedicalCase = new MedicalCaseModel(patient);
    await instanceMedicalCase.create(patient);
    return instanceMedicalCase;
  };

  /**
   * Set patient in localStorage
   */
  savePatient = async () => {
    const { patient } = this.state;

    let errors = await patient.validate();

    // Create patient if there are no errors
    if (_.isEmpty(errors)) {
      await patient.save();
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
