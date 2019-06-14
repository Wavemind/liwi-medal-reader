// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { ScrollView } from 'react-native';
import CustomInput from '../../../components/InputContainer/CustomInput/CustomInput';
import CustomDatePicker from '../../../components/InputContainer/CustomDatePicker/CustomDatePicker';
import { Button, Col, Text, View } from 'native-base';
import { LiwiTitle2 } from '../../../template/layout';
import { PatientModel } from '../../../../frontend_service/engine/models/Patient.model';
import maxBy from 'lodash/maxBy';
import { getArray } from '../../../engine/api/LocalStorage';
import LiwiLoader from '../../../utils/LiwiLoader';
import CustomSwitchButton from '../../../components/InputContainer/CustomSwitchButton';
import i18n from '../../../utils/i18n';

import { styles } from './PatientEdit.style';

type Props = NavigationScreenProps & {};
type State = {};

export default class PatientEdit extends React.Component<Props, State> {

  async componentWillMount() {
    await this.generatePatient();
  }

  state = {
    firstRender: false,
    medicalCases: [],
    isGeneratingPatient: true,
    patients: [],
    firstname: '',
    lastname: '',
    birthdate: '',
    breathingRhythm: '',
    heartbeat: '',
    weight: '',
    temperature: '',
    id: '',
  };

  getPatients = async () => {
    let patients = await getArray('patients');
    this.setState({ patients });
  };

  generatePatient = async () => {
    await this.getPatients();

    let patient = new PatientModel();
    await patient.setPatient();
    let patients = this.state.patients;

    // uniqueId incremented
    let maxId = maxBy(patients, 'id');

    if (patients.length === 0) {
      maxId = { id: 0 };
    }

    patient.id = maxId.id + 1;

    // reload patient in the component
    await this.getPatients();
    await this.setState({
      ...patient,
      firstRender: true,
    });
  };

  updatePatient = (key, value) => {
    console.log(key, value);
  };

  render() {
    const { updatePatient } = this;

    const {
      firstname,
      lastname,
      birthdate,
      firstRender,
      sexe,
    } = this.state;

    return (
      <ScrollView
        contentContainerStyle={styles.container}
      >
        <LiwiTitle2 noBorder>{i18n.t('patient_update:title')}</LiwiTitle2>
        <View>
          <Col>
            <CustomInput
              init={firstname}
              label={i18n.t('patient:first_name')}
              change={updatePatient}
              index={'firstname'}
              iconName={'user'}
              iconType={'AntDesign'}
            />
            <CustomInput
              init={lastname}
              label={i18n.t('patient:last_name')}
              change={updatePatient}
              index={'lastname'}
              iconName={'user'}
              iconType={'AntDesign'}
            />
          </Col>
          <Col>
            <CustomSwitchButton
              init={sexe}
              label={i18n.t('patient:gender')}
              change={updatePatient}
              index={'sexe'}
              label1={i18n.t('patient:male')}
              label2={i18n.t('patient:female')}
              value1={'male'}
              value2={'female'}
              iconName={'human-male-female'}
              iconType={'MaterialCommunityIcons'}
            />
          </Col>
          <Col>
            <CustomDatePicker
              init={birthdate}
              label={i18n.t('patient:birth_date')}
              change={updatePatient}
              index={'birthdate'}
              iconName={'birthday-cake'}
              iconType={'FontAwesome'}

            />
          </Col>
        </View>

        <View bottom-view>
          <Button
            block
          >
            <Text>{i18n.t('update_patient:save')}</Text>
          </Button>
        </View>
      </ScrollView>
    );
  }
}
