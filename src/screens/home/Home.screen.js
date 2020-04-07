// @flow

import * as React from 'react';
import { Image, TouchableHighlight } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { Text, View } from 'native-base';
import { styles } from './Home.style';
import { getItems } from '../../engine/api/LocalStorage';
import { Toaster } from '../../utils/CustomToast';
import ConfirmationView from '../../components/ConfirmationView';

type Props = NavigationScreenProps & {};
type State = {};

export default class Home extends React.Component<Props, State> {
  state = {
    algorithms: [],
    propsToolTipVisible: false,
  };

  shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
    const { algorithms, propsToolTipVisible } = this.state;
    const { medicalCase } = this.props;
    return algorithms !== nextState.algorithms || propsToolTipVisible !== nextState.propsToolTipVisible || Object.compare(medicalCase, nextProps.medicalCase);
  }

  logout = async () => {
    const {
      app: { lockSession },
    } = this.props;
    await lockSession();
  };

  async componentDidMount() {
    const algorithms = await getItems('algorithms');
    this.setState({ algorithms });
  }

  callBackClose = () => {
    this.setState({
      propsToolTipVisible: false,
    });
  };

  render() {
    const {
      navigation,
      app: { t, user },
      medicalCase,
    } = this.props;

    const { algorithms, propsToolTipVisible } = this.state;

    return (
      <View padding-auto testID="HomeScreen" style={{ backgroundColor: '#fff' }}>
        <View flex-container-column>
          <Text bigTitle style={{ textAlign: 'center' }}>
            Welcome {user.preFix} {user.surname} {user.lastname}
          </Text>
          <ConfirmationView propsToolTipVisible={propsToolTipVisible} nextRoute="PatientUpsert" idPatient={null} callBackClose={this.callBackClose} />
          <View w50>
            <TouchableHighlight
              testID="GoToPatientUpsert"
              underlayColor="transparent"
              style={styles.navigationButton}
              onPress={() => {
                if (algorithms.length === 0) {
                  Toaster(t('work_case:no_algorithm'), {
                    type: 'danger',
                    duration: 4000,
                  });
                } else if (medicalCase.id === undefined || medicalCase.isNewCase === 'false') {
                  navigation.navigate('PatientUpsert', {
                    idPatient: null,
                    newMedicalCase: true,
                  });
                } else {
                  this.setState({ propsToolTipVisible: true });
                }
              }}
            >
              <View style={styles.blocContainer}>
                <Image style={styles.icons} resizeMode="contain" source={require('../../../assets/images/heartbeat.png')} />
                <Text size-auto center style={styles.textButton}>
                  {t('navigation:patient_add')}
                </Text>
              </View>
            </TouchableHighlight>
          </View>

          <View w50>
            <TouchableHighlight underlayColor="transparent" style={styles.navigationButton} onPress={() => navigation.navigate('PatientList')}>
              <View style={styles.blocContainer}>
                <Image style={styles.icons} resizeMode="contain" source={require('../../../assets/images/patients.png')} />
                <Text size-auto center style={styles.textButton}>
                  {t('navigation:patient_list')}
                </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight underlayColor="transparent" style={styles.navigationButton} onPress={() => navigation.navigate('MedicalCaseList')}>
              <View style={styles.blocContainer}>
                <Image style={styles.icons} resizeMode="contain" source={require('../../../assets/images/case.png')} />
                <Text size-auto center style={styles.textButton}>
                  {t('navigation:case_in_progress')}
                </Text>
              </View>
            </TouchableHighlight>
          </View>

          <View w50>
            <TouchableHighlight underlayColor="transparent" style={styles.navigationButton} onPress={() => navigation.navigate('Algorithms')}>
              <View style={styles.blocContainer}>
                <Image style={styles.icons} resizeMode="contain" source={require('../../../assets/images/sync.png')} />
                <Text size-auto center style={styles.textButton}>
                  {t('navigation:synchronize')}
                </Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight underlayColor="transparent" style={styles.navigationButton} onPress={() => navigation.navigate('Settings')}>
              <View style={styles.blocContainer}>
                <Image style={styles.icons} resizeMode="contain" source={require('../../../assets/images/settings.png')} />
                <Text size-auto center style={styles.textButton}>
                  {t('navigation:settings')}
                </Text>
              </View>
            </TouchableHighlight>
          </View>

          <View w50>
            <TouchableHighlight
              underlayColor="transparent"
              style={styles.navigationButton}
              onPress={async () => {
                this.forceCrashApp(true);
              }}
            >
              <View style={styles.blocContainer}>
                <Image style={styles.icons} resizeMode="contain" source={require('../../../assets/images/crash.png')} />
                <Text size-auto center style={styles.textButton}>
                  Crash app
                </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight underlayColor="transparent" style={styles.navigationButton} onPress={() => this.logout()}>
              <View style={styles.blocContainer}>
                <Image style={styles.icons} resizeMode="contain" source={require('../../../assets/images/logout.png')} />
                <Text size-auto center style={styles.textButton}>
                  {t('navigation:logout')}
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }
}
