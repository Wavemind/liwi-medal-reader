// @flow

import * as React from 'react';
import { DocumentDirectoryPath, writeFile, mkdir, unlink } from 'react-native-fs';
import { zip } from 'react-native-zip-archive';
import { Button, Text, View } from 'native-base';
import moment from 'moment';

import { LiwiTitle2 } from '../../template/layout';
import { styles } from './Synchronization.style';
import { synchronizeMedicalCases } from '../../../frontend_service/api/Http';
import LiwiLoader from '../../utils/LiwiLoader';
import { getItem } from '../../engine/api/LocalStorage';
import { askWriteStorage } from '../../utils/permission';
import { ActivityModel } from '../../../frontend_service/helpers/Activity.model';

const normalizeFilePath = (path) => (path.startsWith('file://') ? path.slice(7) : path);

export default class Synchronization extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      medicalCasesToSynch: [],
      isReady: false,
      isLoading: false,
      mainDataURL: '',
    };
  }

  async componentDidMount() {
    const {
      app: { database, algorithm },
    } = this.props;

    const session = await getItem('session');
    const mainDataURL = session.facility.main_data_ip;

    const medicalCasesToSynch = [];
    const medicalCases = await database.localInterface.closedAndNotSynchronized();

    // Retrieve all medical cases need to be synchronized
    medicalCases.forEach((medicalCase) => {
      if (medicalCase.canBeSynchronized(algorithm)) {
        medicalCasesToSynch.push(medicalCase);
      }
    });

    this.setState({
      medicalCasesToSynch,
      mainDataURL,
      isReady: true,
    });
  }

  /**
   * Send medical cases to main data
   * @returns {Promise<void>}
   */
  synchronize = async () => {
    const writePermission = await askWriteStorage();

    if (writePermission) {
      const { medicalCasesToSynch, mainDataURL } = this.state;
      const {
        app: { t, database },
      } = this.props;

      this.setState({ isLoading: true });

      const folder = `${DocumentDirectoryPath}/medical_cases`;
      const targetPath = `${folder}.zip`;

      // Create directory
      await mkdir(folder);
      // Generate files
      await Promise.all(
        medicalCasesToSynch.map(async (medicalCase) => {
          const patient = await database.localInterface.findBy('Patient', medicalCase.patient_id);
          const patientAll = await database.localInterface.getAll('Patient', null, null, true);
          const activitiesDB = await medicalCase.activities;
          const activities = await Promise.all(activitiesDB.map((activity) => new ActivityModel(activity)));
          const medicalCaseJson = JSON.stringify({ ...JSON.parse(medicalCase.json), patient: { ...patient, medicalCases: [] }, activities }, (key, value) =>
            typeof value === 'undefined' ? null : value
          );
          await writeFile(`${folder}/${medicalCase.id}.json`, medicalCaseJson);
        })
      );

      // Generate archive
      const path = await zip(normalizeFilePath(folder), targetPath).catch((error) => {
        this.setState({ isLoading: false });
      });

      await Promise.all(
        medicalCasesToSynch.map(async (medicalCase) => {
          await unlink(`${folder}/${medicalCase.id}.json`);
        })
      );

      const result = await synchronizeMedicalCases(mainDataURL, path);

      if (result !== null && result.data_received) {
        // Reset medicalCases to sync if request success
        medicalCasesToSynch.forEach((medicalCase) => {
          database.localInterface.update('MedicalCase', medicalCase.id, { synchronized_at: moment().unix() });
        });

        this.setState({ isLoading: false, error: '', medicalCasesToSynch: [] });
      } else {
        this.setState({ isLoading: false, error: t('synchronize:error'), medicalCasesToSynch });
      }
    }
  };

  render() {
    const {
      app: { t },
    } = this.props;
    const { isReady, isLoading, medicalCasesToSynch, mainDataURL, error } = this.state;

    return (
      <View padding-auto margin-top flex>
        {isReady ? (
          mainDataURL !== '' ? (
            <>
              <LiwiTitle2 style={styles.marginTop} noBorder>
                {t('synchronize:title')}
              </LiwiTitle2>
              <Text style={styles.number}>{medicalCasesToSynch.length}</Text>
              {error !== '' ? <Text style={styles.error}>{error}</Text> : null}
              <View flex-center-row>
                {isLoading ? (
                  <LiwiLoader />
                ) : (
                  <Button onPress={this.synchronize} disabled={medicalCasesToSynch.length === 0}>
                    <Text>{t('synchronize:synchronize')}</Text>
                  </Button>
                )}
              </View>
            </>
          ) : (
            <LiwiTitle2 style={styles.marginTop} noBorder>
              {t('synchronize:main_data_address_missing')}
            </LiwiTitle2>
          )
        ) : (
          <LiwiLoader />
        )}
      </View>
    );
  }
}
