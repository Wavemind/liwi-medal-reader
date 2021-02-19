// @flow

import * as React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { Text, View } from 'native-base';
import { styles } from './Home.style';
import { getItem, getItems} from '../../engine/api/LocalStorage';
import { displayNotification } from '../../utils/CustomToast';
import { liwiColors } from '../../utils/constants';

type Props = NavigationScreenProps & {};
type State = {};

export default class Home extends React.Component<Props, State> {
  static defaultProps = {
    app: { t: () => {} },
  };

  state = {
    session: null,
    medicalCases: [],
    environment: null,
  };

  async componentDidMount() {
    const {
      app: { database, algorithm },
    } = this.props;
    const session = await getItems('session');
    const environment = await getItem('environment');
    const medicalCases = [];

    if (session?.facility.architecture === 'standalone') {
      const realmMedicalCases = await database.realmInterface.closedAndNotSynchronized();

      realmMedicalCases.forEach((medicalCase) => {
        if (medicalCase.canBeSynchronized(algorithm) && medicalCase.isOlderThan1Week()) {
          medicalCases.push(medicalCase);
        }
      });
    }

    this.setState({ environment, session, medicalCases });
  }

  /**
   * Check if there is medical case to synchronize with medAL-data
   * @returns {Promise<boolean>}
   */
  shouldDisplaySynchronizeButton = async () => {
    const {
      app: { database },
    } = this.props;
    const { session } = this.state;

    const realmMedicalCases = await database.realmInterface.closedAndNotSynchronized();

    return session?.facility.architecture === 'standalone' || (session?.facility.architecture === 'client_server' && realmMedicalCases.length > 0);
  };

  render() {
    const {
      navigation,
      app: { t, user, logout, algorithm },
    } = this.props;

    const { medicalCases, environment } = this.state;

    return (
      <View padding-auto testID="HomeScreen">
        <View flex-container-column>
          <Text bigTitle style={{ textAlign: 'center' }}>
            Welcome {user.preFix} {user.first_name} {user.last_name}
          </Text>

          {medicalCases.length > 0 ? (
            <View style={styles.warningBloc}>
              <Text white>{t('synchronize:not_warning')}</Text>
            </View>
          ) : null}

          <View w50>
            {environment !== 'production' && (
              <TouchableOpacity
                testID="GoToPatientUpsert"
                underlayColor="transparent"
                style={styles.navigationButton}
                onPress={() => {
                  if (algorithm === undefined) {
                    displayNotification(t('work_case:no_algorithm'), liwiColors.redColor);
                  } else {
                    navigation.navigate('PatientUpsert', {
                      idPatient: null,
                      newMedicalCase: true,
                    });
                  }
                }}
              >
                <View style={styles.blocContainer}>
                  <Image style={styles.icons} resizeMode="contain" source={require('../../../assets/images/heartbeat.png')} />
                  <Text size-auto center style={styles.textButton}>
                    {t('navigation:patient_add')}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity underlayColor="transparent" style={styles.navigationButton} onPress={() => navigation.navigate('QrCodePatient')}>
              <View style={styles.blocContainer}>
                <Image style={styles.icons} resizeMode="contain" source={require('../../../assets/images/qr_code.png')} />
                <Text size-auto center style={styles.textButton}>
                  {t('navigation:patient_qr')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View w50>
            <TouchableOpacity underlayColor="transparent" style={styles.navigationButton} onPress={() => navigation.navigate('PatientList')}>
              <View style={styles.blocContainer}>
                <Image style={styles.icons} resizeMode="contain" source={require('../../../assets/images/patients.png')} />
                <Text size-auto center style={styles.textButton}>
                  {t('navigation:patient_list')}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity underlayColor="transparent" style={styles.navigationButton} onPress={() => navigation.navigate('MedicalCaseList')}>
              <View style={styles.blocContainer}>
                <Image style={styles.icons} resizeMode="contain" source={require('../../../assets/images/case.png')} />
                <Text size-auto center style={styles.textButton}>
                  {t('navigation:medical_case_list')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View w50>
            <TouchableOpacity underlayColor="transparent" style={styles.navigationButton} onPress={() => navigation.navigate('Settings')}>
              <View style={styles.blocContainer}>
                <Image style={styles.icons} resizeMode="contain" source={require('../../../assets/images/settings.png')} />
                <Text size-auto center style={styles.textButton}>
                  {t('navigation:settings')}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity underlayColor="transparent" style={styles.navigationButton} onPress={() => navigation.navigate('About', { source: 'home' })}>
              <View style={styles.blocContainer}>
                <Image style={styles.icons} resizeMode="contain" source={require('../../../assets/images/about.png')} />
                <Text size-auto center style={styles.textButton}>
                  {t('navigation:about')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {this.shouldDisplaySynchronizeButton() ? (
            <View w50>
              <TouchableOpacity underlayColor="transparent" style={styles.navigationButton} onPress={() => navigation.navigate('Synchronization')}>
                <View style={styles.blocContainer}>
                  <Image style={styles.icons} resizeMode="contain" source={require('../../../assets/images/sync.png')} />
                  <Text size-auto center style={styles.textButton}>
                    {t('navigation:synchronize')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}

          <View w50>
            {algorithm.config.consent_management && (
              <TouchableOpacity underlayColor="transparent" style={styles.navigationButton} onPress={() => navigation.navigate('ConsentList')}>
                <View style={styles.blocContainer}>
                  <Image style={styles.icons} resizeMode="contain" source={require('../../../assets/images/differential.png')} />
                  <Text size-auto center style={styles.textButton}>
                    {t('navigation:consent_list')}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity underlayColor="transparent" style={styles.navigationButton} onPress={() => logout()}>
              <View style={styles.blocContainer}>
                <Image style={styles.icons} resizeMode="contain" source={require('../../../assets/images/logout.png')} />
                <Text size-auto center style={styles.textButton}>
                  {t('navigation:logout')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
