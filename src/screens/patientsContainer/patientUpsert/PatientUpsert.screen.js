// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { ScrollView } from 'react-native';
import { Button, Col, Text, View } from 'native-base';
import * as _ from 'lodash';
import CustomInput from '../../../components/InputContainer/CustomInput/CustomInput';
import CustomDatePicker from '../../../components/InputContainer/CustomDatePicker/CustomDatePicker';
import { PatientModel } from '../../../../frontend_service/engine/models/Patient.model';
import { MedicalCaseModel } from '../../../../frontend_service/engine/models/MedicalCase.model';
import { LiwiTitle2 } from '../../../template/layout';
import CustomSwitchButton from '../../../components/InputContainer/CustomSwitchButton';
import i18n from '../../../utils/i18n';
import { NavigationActions } from 'react-navigation';

import { styles } from './PatientUpsert.style';
import { getItemFromArray, getMedicalCase } from '../../../engine/api/LocalStorage';

type Props = NavigationScreenProps & {};
type State = {};

export default class PatientUpsert extends React.Component<Props, State> {
  state = {
    errors: {},
    patient: {},
    firstRender: false,
    idLastMedicalCase: null,
  };

  async componentWillMount() {
    const { navigation } = this.props;

    let idPatient = navigation.getParam('idPatient');
    if (idPatient === null) {
      let patient = new PatientModel();
      this.setState({ patient, firstRender: true });
    } else {
      await this.getPatient();
    }
  }

  // Update patient value in storage and redirect to patient profile
  updatePatient = async () => {
    const { navigation } = this.props;
    await this.savePatient();
    navigation.dispatch(
      NavigationActions.back('patientProfile', { id: this.state.patient.id })
    );
  };

  // Update state value of patient
  updatePatientValue = async (key, value) => {
    const { patient } = this.state;
    patient[key] = value;
    await this.setState({ patient });
  };

  // Save patient and redirect to waiting list
  saveWaitingList = async () => {
    const { navigation } = this.props;
    let result = await this.savePatient();

    if (result) {
      navigation.dispatch(NavigationActions.back('patientList'));
    }
  };

  // Save patient and redirect to medical case
  saveNewCase = async () => {
    const { idLastMedicalCase, patient } = this.state;
    let result = await this.savePatient();

    if (result) {
      const { setMedicalCase, navigation } = this.props;
      let medicalCase = await getMedicalCase(idLastMedicalCase);
      medicalCase.patient = patient
      await setMedicalCase(medicalCase);

      navigation.navigate('Triage', {
        title: `${medicalCase.patient.firstname} ${
          medicalCase.patient.lastname
        }`,
      });
    }
  };

  // Get patient with id in navigation props
  async getPatient() {
    const { navigation } = this.props;
    let id = navigation.getParam('idPatient');

    let patient = await getItemFromArray('patients', 'id', id);
    patient = new PatientModel(patient);

    this.setState({ patient, firstRender: true });
  }

  // Generate medical case for current patient
  generateMedicalCase = async (patientId) => {
    let instanceMedicalCase = new MedicalCaseModel();
    await instanceMedicalCase.createMedicalCase(patientId);
    return instanceMedicalCase.id;
  };

  // Set patient in localStorage
  savePatient = async () => {
    const { patient } = this.state;
    let idPatient = this.props.navigation.getParam('idPatient');

    let errors = await patient.validate();

    // Create patient if there are no errors
    if (_.isEmpty(errors)) {
      await patient.save();

      if (idPatient === null) {
        let id = await this.generateMedicalCase(patient.id);
        this.setState({ idLastMedicalCase: id });
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
      patient: { firstname, lastname, birthdate, gender },
      errors,
      firstRender,
    } = this.state;

    const { navigation } = this.props;

    let idPatient = navigation.getParam('idPatient');

    if (!firstRender) {
      return null;
    }

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <LiwiTitle2 noBorder>{i18n.t('patient_upsert:title')}</LiwiTitle2>
        <View>
          <Col>
            <CustomInput
              init={firstname}
              label={i18n.t('patient:first_name')}
              change={updatePatientValue}
              index={'firstname'}
              iconName={'user'}
              iconType={'AntDesign'}
              error={errors.firstname}
            />
            <CustomInput
              init={lastname}
              label={i18n.t('patient:last_name')}
              change={updatePatientValue}
              index={'lastname'}
              iconName={'user'}
              iconType={'AntDesign'}
              error={errors.lastname}
            />
          </Col>
          <Col>
            <CustomSwitchButton
              init={gender}
              label={i18n.t('patient:gender')}
              change={updatePatientValue}
              index={'gender'}
              label1={i18n.t('patient:male')}
              label2={i18n.t('patient:female')}
              value1={'male'}
              value2={'female'}
              iconName={'human-male-female'}
              iconType={'MaterialCommunityIcons'}
              error={errors.gender}
            />
          </Col>
          <Col>
            <CustomDatePicker
              init={birthdate}
              label={i18n.t('patient:birth_date')}
              change={updatePatientValue}
              index={'birthdate'}
              iconName={'birthday-cake'}
              iconType={'FontAwesome'}
              error={errors.birthdate}
            />
          </Col>
        </View>

        <View bottom-view>
          {idPatient === null ? (
            <View columns>
              <Button light split onPress={saveWaitingList}>
                <Text>{i18n.t('patient_upsert:save_and_wait')}</Text>
              </Button>
              <Button light split onPress={saveNewCase}>
                <Text>{i18n.t('patient_upsert:save_and_case')}</Text>
              </Button>
            </View>
          ) : (
            <Button block onPress={this.updatePatient}>
              <Text>{i18n.t('patient_upsert:save')}</Text>
            </Button>
          )}
        </View>
      </ScrollView>
    );
  }
}
