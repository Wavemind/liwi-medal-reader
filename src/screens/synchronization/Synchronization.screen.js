// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Button, Text, View } from 'native-base';
import moment from 'moment';
import { getItem, getItems } from '../../engine/api/LocalStorage';
import LiwiLoader from '../../utils/LiwiLoader';
import { LiwiTitle2 } from '../../template/layout';
import { styles } from '../algorithmsContainer/Algorithms/Algorithms.style';
import { synchronizeMedicalCases } from '../../../frontend_service/api/Http';
import LiwiProgressBar from '../../utils/LiwiProgressBar';

type Props = NavigationScreenProps & {};
type State = {};

export default class Synchronization extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      patients: [],
      medicalCasesToSynch: [],
      isReady: false,
      isLoading: false,
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
        // TODO: test if has to be push (eligibility, etc.)
        console.log(medicalCase);
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

  synchronize = async () => {
    const { medicalCasesToSynch } = this.state;
    this.setState({ isLoading: true });
    await synchronizeMedicalCases(medicalCasesToSynch);
    this.setState({ isLoading: false });
  };

  render() {
    const {
      app: { t },
    } = this.props;
    const { isReady, isLoading, medicalCasesToSynch } = this.state;

    return (
      <View padding-auto margin-top>
        {isReady ? (
          <>
            <LiwiTitle2 noBorder>Medical cases to sync</LiwiTitle2>
            <Text center>{medicalCasesToSynch.length}</Text>
            <View flex-center-row>
              {isLoading ? (
                <LiwiProgressBar />
              ) : (
                <Button style={styles.marginTop} onPress={this.synchronize} disabled={medicalCasesToSynch.length === 0}>
                  <Text>{t('algorithms:synchronize')}</Text>
                </Button>
              )}
            </View>
          </>
        ) : (
          <LiwiLoader />
        )}
      </View>
    );
  }
}
