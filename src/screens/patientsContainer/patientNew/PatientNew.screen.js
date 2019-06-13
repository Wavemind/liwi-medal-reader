// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { ScrollView } from 'react-native';
import CustomInput from '../../../components/InputContainer/CustomInput/CustomInput';
import CustomDatePicker from '../../../components/InputContainer/CustomDatePicker/CustomDatePicker';
import { Button, Col, Text, View } from 'native-base';
import { LiwiTitle2 } from '../../../template/layout';
import CustomSwitchButton from '../../../components/InputContainer/CustomSwitchButton';
import i18n from '../../../utils/i18n';

import { styles } from './PatientNew.style';

type Props = NavigationScreenProps & {};
type State = {};

export default class PatientNew extends React.Component<Props, State> {

  state = {
    firstRender: false,
    medicalCases: [],
    isGeneratingPatient: true,
    patients: [],
    firstname: '',
    lastname: '',
    birthdate: new Date(1960, 1, 1),
    breathingRhythm: '',
    heartbeat: '',
    weight: '',
    temperature: '',
    id: '',
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
      sexe,
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
          <View style={styles.columns}>
            <Button
              light
              style={styles.splitButton}
            >
              <Text>{i18n.t('patient_new:save_and_wait')}</Text>
            </Button>
            <Button
              light
              style={styles.splitButton}
            >
              <Text>{i18n.t('patient_new:save_and_case')}</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    );
  }
}
