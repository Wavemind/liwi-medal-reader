// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { ScrollView } from 'react-native';
import CustomInput from '../../../components/InputContainer/CustomInput/CustomInput';
import CustomDatePicker from '../../../components/InputContainer/CustomDatePicker/CustomDatePicker';
import { Button, Col, Text, View } from 'native-base';
import { LiwiTitle2 } from '../../../template/layout';
import { getItemFromArray } from '../../../engine/api/LocalStorage';
import LiwiLoader from '../../../utils/LiwiLoader';
import CustomSwitchButton from '../../../components/InputContainer/CustomSwitchButton';
import i18n from '../../../utils/i18n';

import { styles } from './PatientEdit.style';

type Props = NavigationScreenProps & {};
type State = {};

export default class PatientEdit extends React.Component<Props, State> {

  state = {
    firstRender: false,
    id: '',
    firstname: '',
    lastname: '',
    birthdate: new Date(1960, 1, 1),
    gender: null,
    medicalCases: [],
    errors: {},
  };

  async componentWillMount() {
    await this.getPatient();
  }

  // Get patient data storaged in localstorage
  async getPatient() {
    const { navigation } = this.props;
    let id = navigation.getParam('id');

    let patient = await getItemFromArray('patients', 'id', id);

    this.setState(
      {
        ...patient,
        firstRender: true,
      });
  }

  updatePatient = (key, value) => {
    console.log(key, value);
  };

  render() {
    const { updatePatient } = this;

    const {
      firstname,
      firstRender,
      lastname,
      birthdate,
      gender,
      errors,
    } = this.state;

    return !firstRender ? (
      <LiwiLoader/>
    ) : (
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
