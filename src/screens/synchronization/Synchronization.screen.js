// @flow

import * as React from 'react';
import { DocumentDirectoryPath, writeFile, mkdir, write } from 'react-native-fs';
import uuid from 'react-native-uuid';
import { zip } from 'react-native-zip-archive';
import { NavigationScreenProps } from 'react-navigation';
import { Button, Text, View } from 'native-base';
import LiwiLoader from '../../utils/LiwiLoader';
import { LiwiTitle2 } from '../../template/layout';
import { styles } from './Synchronization.style';
import { synchronizeMedicalCases } from '../../../frontend_service/api/Http';


type Props = NavigationScreenProps & {};
type State = {};

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
   * Send medical cases to main data
   * @returns {Promise<void>}
   */
  synchronize = async () => {
    const { medicalCasesToSynch } = this.state;
    this.setState({ isLoading: true });

    const folder = `${DocumentDirectoryPath}/test`;
    const targetPath = `${folder}.zip`;
console.log(folder)
    // write file
    await mkdir(folder);
console.log("j'ai créer le directory")
    await writeFile(`${folder}/cc.json`, JSON.stringify({id: 11}));
console.log("J'ai écrit dans le fichier")
    // medicalCasesToSynch.map(async (medicalCase) => {
    //   await writeFile(`${folder}/${medicalCase.id}.json`, JSON.stringify(medicalCase));
    // });

    const path = zip(DocumentDirectoryPath, targetPath)
      .catch((error) => {
        console.error(error);
        this.setState({ isLoading: false});
      });

    console.log(`zip completed at ${path}`);
    this.setState({ isLoading: false});

    // const result = await synchronizeMedicalCases(medicalCasesToSynch);

    // Reset medicalCases to sync if request success
    // this.setState({ isLoading: false, medicalCasesToSynch: result !== null ? [] : medicalCasesToSynch });
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
                <Button onPress={this.synchronize}>
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
