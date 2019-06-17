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
import { NavigationActions, StackActions } from 'react-navigation';

import { styles } from './PatientNew.style';
import { getItemFromArray } from '../../../engine/api/LocalStorage';

type Props = NavigationScreenProps & {};
type State = {};

export default class PatientNew extends React.Component<Props, State> {

  state = {
    errors: {},
    patient: {},
  };

  async componentWillMount() {
    const {
      navigation
    } = this.props;

    let idPatient = navigation.getParam('idPatient');
    console.log(idPatient)
    if (idPatient === null) {
      let patient = new PatientModel();
      this.setState({ patient });
    } else {
      await this.getPatient()
    }

  }


  // Update state value of patient
  updatePatient = async (key, value) => {
    const { patient } = this.state;
    patient[key] = value;
    await this.setState({ patient });
  };

  // Save patient and redirect to waiting list
  saveWaitingList = async () => {
    const { navigation } = this.props;
    let result = await this.savePatient();

    console.log(navigation);

    if (result) {
      navigation.dispatch(NavigationActions.back('patientList'));
    }
  };

  // Save patient and redirect to medical case
  saveNewCase = async () => {
    const { navigation } = this.props;
    let result = await this.savePatient();

    if (result) {
      navigation.navigate('MUST BE CHANGE');
    }
  };

  async getPatient() {
    const { navigation } = this.props;
    let id = navigation.getParam('idPatient');

    let patient = await getItemFromArray('patients', 'id', id);
    patient = new PatientModel(patient);


    console.log(patient)


    this.setState({ patient });
  }

  // Set patient in localStorage
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
    const {
      updatePatient,
      saveWaitingList,
      saveNewCase,
    } = this;

    const {
      patient: {
        firstname,
        lastname,
        birthdate,
        gender,
      },
      errors,
    } = this.state;

    const {
      navigation,
    } = this.props;

    let idPatient = navigation.getParam('idPatient');

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
          {
            idPatient === null ? <View style={styles.columns}>
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
            </View> : <Button
              block
            >
              <Text>{i18n.t('update_patient:save')}</Text>
            </Button>
          }

        </View>
      </ScrollView>
    );
  }
}
