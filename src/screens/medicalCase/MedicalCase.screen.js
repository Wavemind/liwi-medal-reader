// @flow

import * as React from 'react';
import { Col, Grid } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { ScrollView } from 'react-native';
import LwInput from '../../components/formContainer/lwInput/LwInput';
import LwDatePicker from '../../components/formContainer/lwDatePicker/LwDatePicker';
import { LiwiTitle2, LiwiTitle3 } from '../../template/layout';
import moment from 'moment';

type Props = NavigationScreenProps & {};

type State = {};

export default class MedicalCase extends React.Component<Props, State> {
  state = { medicalCases: [] };

  render() {
    const {
      medicalCase: {
        patient: {
          firstname,
          lastname,
          birthdate,
          breathingRhythm,
          heartbeat,
          weight,
          temperature,
        },
      },
      updatePatient,
      medicalCase,
    } = this.props;

    return (
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
            <LwInput
              init={firstname}
              label={'Prénom'}
              change={updatePatient}
              index={'firstname'}
              id={medicalCase.id}
              iconName={'user'}
              iconType={'AntDesign'}
            />
          </Col>
          <Col>
            <LwInput
              init={lastname}
              label={'Nom'}
              change={updatePatient}
              index={'lastname'}
              id={medicalCase.id}
              iconName={'user'}
              iconType={'AntDesign'}
            />
          </Col>
        </Grid>
        <Grid>
          <Col>
            <LwInput
              init={lastname}
              label={'Nom'}
              change={updatePatient}
              index={'lastname'}
              id={medicalCase.id}
              iconName={'user'}
              iconType={'AntDesign'}
            />
          </Col>
          <Col>
            <LwDatePicker
              init={birthdate}
              label={'Date de naissance'}
              change={updatePatient}
              index={'birthdate'}
              iconName={'birthday-cake'}
              iconType={'FontAwesome'}
            />
          </Col>
        </Grid>
        <LiwiTitle3>Santé</LiwiTitle3>
        <Grid>
          <Col>
            <LwInput
              init={breathingRhythm}
              label={'Rythme cardiaque'}
              change={updatePatient}
              index={'breathingRhythm'}
              id={medicalCase.id}
              iconName={'heartbeat'}
              iconType={'FontAwesome'}
              keyboardType={'numeric'}
            />
          </Col>
          <Col>
            <LwInput
              init={heartbeat}
              label={'Battements de cœur'}
              change={updatePatient}
              index={'heartbeat'}
              id={medicalCase.id}
              iconName={'ios-headset'}
              iconType={'Ionicons'}
              keyboardType={'numeric'}
            />
          </Col>
        </Grid>
        <Grid>
          <Col>
            <LwInput
              init={temperature}
              label={'Température'}
              change={updatePatient}
              index={'temperature'}
              id={medicalCase.id}
              iconName={'temperature-celsius'}
              iconType={'MaterialCommunityIcons'}
              keyboardType={'numeric'}
            />
          </Col>
          <Col>
            <LwInput
              init={weight}
              label={'Poids'}
              change={updatePatient}
              index={'weight'}
              id={medicalCase.id}
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
