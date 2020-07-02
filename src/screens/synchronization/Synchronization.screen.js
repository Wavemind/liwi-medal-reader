// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Text, View } from 'native-base';
import moment from 'moment';
import { getItem, getItems } from '../../engine/api/LocalStorage';
import LiwiLoader from '../../utils/LiwiLoader';
import { LiwiTitle2 } from '../../template/layout';

type Props = NavigationScreenProps & {};
type State = {};

export default class Synchronization extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      patients: [],
      medicalCasesToSynch: [],
      isReady: false,
    };
  }

  async componentDidMount() {
    const { medicalCase: reduxMedicalCase } = this.props;

    const patients = await getItems('patients');
    const synchronisation = await getItem('synchronisation');

    const medicalCasesToSynch = [];

    // Retrieve all medical cases need to be synchronized
    patients.map((patient) =>
      patient.medicalCases.forEach((medicalCase) => {
        if (medicalCase.synchronized_at === null || moment(medicalCase.updated_at) > moment(medicalCase.synchronized_at)) {
          if (reduxMedicalCase.id === medicalCase.id) {
            medicalCasesToSynch.push(reduxMedicalCase);
          } else {
            medicalCasesToSynch.push(medicalCase);
          }
        }
      })
    );

    this.setState({
      patients,
      synchronisation,
      medicalCasesToSynch,
      isReady: true,
    });
  }

  render() {
    const { isReady } = this.state;

    return (
      <View padding-auto margin-top>
        {isReady ? (
          <>
            <LiwiTitle2 noBorder>Medical cases to sync</LiwiTitle2>
          </>
        ) : <LiwiLoader />}
      </View>
    );
  }
}
