// @flow

import * as React from 'react';
import { Image, TouchableHighlight } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { Text, View } from 'native-base';
import { styles } from './Home.style';
import { getItems } from '../../engine/api/LocalStorage';
import { displayNotification } from '../../utils/CustomToast';
import ConfirmationView from '../../components/ConfirmationView';
import { liwiColors } from '../../utils/constants';
import ToolTipModal from '../../components/ToolTipModal';
import QrCodePatient from '../../components/QrCodePatient';

type Props = NavigationScreenProps & {};
type State = {};

export default class Home extends React.Component<Props, State> {
  static defaultProps = {
    app: { t: () => {} },
  };

  state = {
    qrcode: false,
    modalQrCode: false,
    algorithm: null,
    propsToolTipVisible: false,
  };

  shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
    const { propsToolTipVisible, modalQrCode } = this.state;
    const { medicalCase } = this.props;
    return propsToolTipVisible !== nextState.propsToolTipVisible || Object.compare(medicalCase, nextProps.medicalCase) || modalQrCode !== nextProps.modalQrCode;
  }

  async componentDidMount() {
    const algorithm = await getItems('algorithm');
    this.setState({ algorithm });
  }

  callBackClose = (canContinue) => {
    const { qrcode } = this.state;
    if (qrcode && !canContinue) {
      this.setState({
        propsToolTipVisible: false,
        modalQrCode: true,
      });
    } else {
      this.setState({
        propsToolTipVisible: false,
      });
    }
  };

  render() {
    const {
      navigation,
      app: { t, user, logout },
      medicalCase,
    } = this.props;

    const { algorithm, propsToolTipVisible, qrcode, modalQrCode } = this.state;

    return (
      <View padding-auto testID="HomeScreen" style={styles.back}>
        <View flex-container-column>
          <Text bigTitle style={{ textAlign: 'center' }}>
            Welcome {user.preFix} {user.first_name} {user.last_name}
          </Text>
          <ToolTipModal visible={modalQrCode} closeModal={() => this.setState({ modalQrCode: false })}>
            <QrCodePatient closeModal={() => this.setState({ modalQrCode: false })} />
          </ToolTipModal>
          <ConfirmationView propsToolTipVisible={propsToolTipVisible} nextRoute="PatientUpsert" idPatient={null} callBackClose={this.callBackClose} qrcode={qrcode} />
          <View w50>
            <TouchableHighlight
              testID="GoToPatientUpsert"
              underlayColor="transparent"
              style={styles.navigationButton}
              onPress={() => {
                if (algorithm === null) {
                  displayNotification(t('work_case:no_algorithm'), liwiColors.redColor);
                } else if (medicalCase.id === undefined || medicalCase.isNewCase === 'false') {
                  navigation.navigate('PatientUpsert', {
                    idPatient: null,
                    newMedicalCase: true,
                  });
                } else {
                  this.setState({ propsToolTipVisible: true, qrcode: false });
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

            <TouchableHighlight
              testID="GoToPatientUpsert"
              underlayColor="transparent"
              style={styles.navigationButton}
              onPress={() => {
                if (algorithm === null) {
                  displayNotification(t('work_case:no_algorithm'), liwiColors.redColor);
                } else if (medicalCase.id === undefined || medicalCase.isNewCase === 'false') {
                  this.setState({ modalQrCode: true });
                } else {
                  this.setState({ propsToolTipVisible: true, qrcode: true });
                }
              }}
            >
              <View style={styles.blocContainer}>
                <Image style={styles.icons} resizeMode="contain" source={require('../../../assets/images/qr_code.png')} />
                <Text size-auto center style={styles.textButton}>
                  {t('navigation:patient_qr')}
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
                  {t('navigation:medical_case_list')}
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

            <TouchableHighlight underlayColor="transparent" style={styles.navigationButton} onPress={() => logout()}>
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
