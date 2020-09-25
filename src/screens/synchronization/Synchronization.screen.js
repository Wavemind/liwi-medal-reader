// @flow

import * as React from 'react';
import { DocumentDirectoryPath, writeFile, mkdir } from 'react-native-fs';
import { zip } from 'react-native-zip-archive';
import { NavigationScreenProps } from 'react-navigation';
import { Button, Text, View } from 'native-base';
import { PermissionsAndroid } from 'react-native';
import { LiwiTitle2 } from '../../template/layout';
import { styles } from './Synchronization.style';
import { synchronizeMedicalCases } from '../../../frontend_service/api/Http';
import LiwiLoader from '../../utils/LiwiLoader';

type Props = NavigationScreenProps & {};
type State = {};

const normalizeFilePath = (path) => (path.startsWith('file://') ? path.slice(7) : path);

export default class Synchronization extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      medicalCasesToSynch: [],
      isReady: false,
      isLoading: false,
    };
  }

  async componentDidMount() {
    const {
      medicalCase: reduxMedicalCase,
      app: { database },
    } = this.props;

    const medicalCasesToSynch = [];
    const medicalCases = await database.realmInterface.closedAndNotSynchronized();

    // Retrieve all medical cases need to be synchronized
    medicalCases.forEach((medicalCase) => {
      if (medicalCase.canBeSynchronized()) {
        if (reduxMedicalCase.id === medicalCase.id) {
          medicalCasesToSynch.push(reduxMedicalCase);
        } else {
          medicalCasesToSynch.push(medicalCase);
        }
      }
    });

    this.setState({
      medicalCasesToSynch,
      isReady: true,
    });
  }

  /**
   * Ask user to allow write in external storage
   * Not used actually
   * @returns {Promise<*>}
   * @private
   */
  _askWriteStorage = async () => {
    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
  };

  /**
   * Send medical cases to main data
   * @returns {Promise<void>}
   */
  synchronize = async () => {
    const writePermission = await this._askWriteStorage();

    if (writePermission) {
      const { medicalCasesToSynch } = this.state;
      this.setState({ isLoading: true });

      const folder = `${DocumentDirectoryPath}/medicalCases`;
      const targetPath = `${folder}.zip`;

      // Create directory
      await mkdir(folder);

      // Generate files
      medicalCasesToSynch.map(async (medicalCase) => {
        await writeFile(`${folder}/${medicalCase.id}.json`, JSON.stringify(medicalCase));
      });

      // Generate archive
      const path = await zip(normalizeFilePath(folder), targetPath).catch((error) => {
        console.error(error);
        this.setState({ isLoading: false });
      });

      const result = await synchronizeMedicalCases(path);

      // Reset medicalCases to sync if request success
      this.setState({ isLoading: false, medicalCasesToSynch: result !== null ? [] : medicalCasesToSynch });
    }
  };

  render() {
    const {
      app: { t },
    } = this.props;
    const { isReady, isLoading, medicalCasesToSynch } = this.state;

    return (
      <View padding-auto margin-top flex>
        {isReady ? (
          <>
            <LiwiTitle2 style={styles.marginTop} noBorder>
              {t('synchronize:title')}
            </LiwiTitle2>
            <Text style={styles.number}>{medicalCasesToSynch.length}</Text>
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
          <LiwiLoader />
        )}
      </View>
    );
  }
}
