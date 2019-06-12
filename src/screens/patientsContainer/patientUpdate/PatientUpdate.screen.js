// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { ScrollView } from 'react-native';
import CustomInput from '../../../components/InputContainer/CustomInput/CustomInput';
import CustomDatePicker from '../../../components/InputContainer/CustomDatePicker/CustomDatePicker';
import moment from 'moment/moment';
import { Col, Grid } from 'native-base';
import { LiwiTitle2, LiwiTitle3 } from '../../../template/layout';
import { PatientModel } from '../../../../frontend_service/engine/models/Patient.model';
import maxBy from 'lodash/maxBy';
import { getArray, setItem } from '../../../engine/api/LocalStorage';
import LiwiLoader from '../../../utils/LiwiLoader';
import CustomSwitchButton from '../../../components/InputContainer/CustomSwitchButton';

type Props = NavigationScreenProps & {};
type State = {};

export default class PatientUpdate extends React.Component<Props, State> {

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
      breathingRhythm,
      heartbeat,
      weight,
      firstRender,
      temperature,
      sexe,
    } = this.state;

    console.log(this.props, this.state);


    return !firstRender ? (
      <LiwiLoader />
    ) : (
      <ScrollView>
        <LiwiTitle2>
          {firstname} - {lastname}{' '}
          {moment(birthdate)
            .month(0)
            .from(moment().month(0))}
        </LiwiTitle2>
        <LiwiTitle3>Personnel</LiwiTitle3>
        <Grid>
          <Col>
            <CustomInput
              init={firstname}
              label={'Prénom'}
              change={updatePatient}
              index={'firstname'}
              iconName={'user'}
              iconType={'AntDesign'}
            />
          </Col>
          <Col>
            <CustomInput
              init={lastname}
              label={'Nom'}
              change={updatePatient}
              index={'lastname'}
              iconName={'user'}
              iconType={'AntDesign'}
            />
          </Col>
        </Grid>
        <Grid>
          <Col>
            <CustomDatePicker
              init={birthdate}
              label={'Date de naissance'}
              change={updatePatient}
              index={'birthdate'}
              iconName={'birthday-cake'}
              iconType={'FontAwesome'}
            />
          </Col>
          <Col>
            <CustomSwitchButton
              init={sexe}
              label={'Sexe'}
              change={updatePatient}
              index={'sexe'}
              label1={'Homme'}
              label2={'Femme'}
              iconName={'human-male-female'}
              iconType={'MaterialCommunityIcons'}
            />
          </Col>
        </Grid>
        <LiwiTitle3>Santé</LiwiTitle3>
        <Grid>
          <Col>
            <CustomInput
              init={breathingRhythm}
              label={'Rythme cardiaque'}
              change={updatePatient}
              index={'breathingRhythm'}
              iconName={'heartbeat'}
              iconType={'FontAwesome'}
              keyboardType={'numeric'}
            />
          </Col>
          <Col>
            <CustomInput
              init={heartbeat}
              label={'Battements de cœur'}
              change={updatePatient}
              index={'heartbeat'}
              iconName={'ios-headset'}
              iconType={'Ionicons'}
              keyboardType={'numeric'}
            />
          </Col>
        </Grid>
        <Grid>
          <Col>
            <CustomInput
              init={temperature}
              label={'Température'}
              change={updatePatient}
              index={'temperature'}
              iconName={'temperature-celsius'}
              iconType={'MaterialCommunityIcons'}
              keyboardType={'numeric'}
            />
          </Col>
          <Col>
            <CustomInput
              init={weight}
              label={'Poids'}
              change={updatePatient}
              index={'weight'}
              iconName={'weight'}
              iconType={'MaterialCommunityIcons'}
              keyboardType={'numeric'}
            />
          </Col>
        </Grid>
      </ScrollView>
    );
  }
}
