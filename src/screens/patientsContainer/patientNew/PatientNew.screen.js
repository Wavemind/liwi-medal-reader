// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { ScrollView } from 'react-native';
import { Button, Col, Text, View } from 'native-base';
import * as _ from 'lodash';
import CustomInput from '../../../components/InputContainer/CustomInput/CustomInput';
import CustomDatePicker from '../../../components/InputContainer/CustomDatePicker/CustomDatePicker';
import { PatientModel } from '../../../../frontend_service/engine/models/Patient.model';
import { LiwiTitle2 } from '../../../template/layout';
import CustomSwitchButton from '../../../components/InputContainer/CustomSwitchButton';
import i18n from '../../../utils/i18n';

import { styles } from './PatientNew.style';

type Props = NavigationScreenProps & {};
type State = {};

export default class PatientNew extends React.Component<Props, State> {

  state = {
    id: '',
    firstname: '',
    lastname: '',
    birthdate: new Date(1960, 1, 1),
    gender: null,
    medicalCases: [],
    errors: {},
  };

  // Update state value of patient
  updatePatient = async (key, value) => {
    await this.setState({ [key]: value });
  };

  // Save patient and redirect to waiting list
  saveWaitingList = async () => {
    const { navigation } = this.props;
    let result = await this.savePatient();

    if (result) {
      navigation.navigate('PatientList')
    }
  };

  // Save patient and redirect to medical case
  saveNewCase = async () => {
    const { navigation } = this.props;
    let result = await this.savePatient();

    if (result) {
      navigation.navigate('MUST BE CHANGE')
    }
  };

  // Set patient in localStorage
  savePatient = async () => {
    let patient = new PatientModel();
    let errors = await patient.validate(this.state);

    // Create patient if there are no errors
    if (_.isEmpty(errors)) {
      patient.save(this.state);
      return true
    } else {
      this.setState({errors: errors});
      return false;
    }
  };

  render() {
    const {
      updatePatient,
      saveWaitingList,
      saveNewCase,
    } = this;

    const {
      firstname,
      lastname,
      birthdate,
      gender,
      errors,
    } = this.state;

    return (
      <ScrollView
        contentContainerStyle={styles.container}
      >
        <LiwiTitle2 noBorder>{i18n.t('patient_new:title')}</LiwiTitle2>
        <View>
          <Col>
            <CustomInput
              init={firstname}
              label={i18n.t('patient:first_name')}
              change={updatePatient}
              index={'firstname'}
              iconName={'user'}
              iconType={'AntDesign'}
              error={errors.firstname}
            />
            <CustomInput
              init={lastname}
              label={i18n.t('patient:last_name')}
              change={updatePatient}
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
              change={updatePatient}
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
              change={updatePatient}
              index={'birthdate'}
              iconName={'birthday-cake'}
              iconType={'FontAwesome'}
              error={errors.birthdate}

            />
          </Col>
        </View>

        <View bottom-view>
          <View style={styles.columns}>
            <Button
              light
              style={styles.splitButton}
              onPress={saveWaitingList}
            >
              <Text>{i18n.t('patient_new:save_and_wait')}</Text>
            </Button>
            <Button
              light
              style={styles.splitButton}
              onPress={saveNewCase}
            >
              <Text>{i18n.t('patient_new:save_and_case')}</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    );
  }
}
