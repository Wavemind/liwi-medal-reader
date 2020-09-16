// @flow

import * as React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { Text, View } from 'native-base';
import { styles } from './Home.style';
import { getItems } from '../../engine/api/LocalStorage';
import { displayNotification } from '../../utils/CustomToast';
import { liwiColors } from '../../utils/constants';
import { modalType } from '../../../frontend_service/constants';

type Props = NavigationScreenProps & {};
type State = {};

export default class Home extends React.Component<Props, State> {
  static defaultProps = {
    app: { t: () => {} },
  };

  state = {
    session: null,
  };

  async componentDidMount() {
    const session = await getItems('session');
    this.setState({ session });
  }

  /**
   * Open redux modal
   */
  aboutModal = () => {
    const { updateModalFromRedux } = this.props;
    updateModalFromRedux({ }, modalType.about);
  };

  render() {
    const {
      navigation,
      app: { t, user, logout, algorithm },
    } = this.props;

    const { session } = this.state;

    return (
      <View padding-auto testID="HomeScreen">
        <View flex-container-column>
          <Text bigTitle style={{ textAlign: 'center' }}>
            Welcome {user.preFix} {user.first_name} {user.last_name}
          </Text>
          <View w50>
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
            {session?.facility.architecture === 'standalone' ? (
              <TouchableOpacity underlayColor="transparent" style={styles.navigationButton} onPress={() => navigation.navigate('Synchronization')}>
                <View style={styles.blocContainer}>
                  <Image style={styles.icons} resizeMode="contain" source={require('../../../assets/images/sync.png')} />
                  <Text size-auto center style={styles.textButton}>
                    {t('navigation:synchronize')}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity underlayColor="transparent" style={styles.navigationButton} onPress={() => navigation.navigate('Settings')}>
              <View style={styles.blocContainer}>
                <Image style={styles.icons} resizeMode="contain" source={require('../../../assets/images/settings.png')} />
                <Text size-auto center style={styles.textButton}>
                  {t('navigation:settings')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View w50>
            <TouchableOpacity underlayColor="transparent" style={styles.navigationButton} onPress={this.aboutModal}>
              <View style={styles.blocContainer}>
                <Image style={styles.icons} resizeMode="contain" source={require('../../../assets/images/about.png')} />
                <Text size-auto center style={styles.textButton}>
                  {t('navigation:about')}
                </Text>
              </View>
            </TouchableOpacity>

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
