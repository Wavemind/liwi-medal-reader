// @flow

import * as React from 'react';
import { TouchableHighlight } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { Icon, Text, View } from 'native-base';
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
    let algorithms = await getItems('algorithms');
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
      app: { t },
      medicalCase,
    } = this.props;

    const { algorithms, propsToolTipVisible } = this.state;

    return (
      <View padding-auto>
        <View flex-container-column>
          <ConfirmationView propsToolTipVisible={propsToolTipVisible} nextRoute="PatientUpsert" idPatient={null}
                            callBackClose={this.callBackClose} />
          <View w50>
            <TouchableHighlight
              underlayColor="transparent"
              style={styles.navigationButton}
              onPress={() => {
                if (algorithms.length === 0) {
                  Toaster(t('work_case:no_algorithm'), {
                    type: 'danger',
                    duration: 4000,
                  });
                } else {
                  if (medicalCase.id === undefined || medicalCase.isNewCase === 'false') {
                    navigation.navigate('PatientUpsert', {
                      idPatient: null,
                      newMedicalCase: true,
                    });
                  } else {
                    this.setState({ propsToolTipVisible: true });
                  }
                }
              }}
            >
              <View>
                <Icon type="MaterialCommunityIcons" name="account-plus" style={styles.icons} navigation />
                <Text size-auto center>
                  {t('navigation:patient_add')}
                </Text>
              </View>
            </TouchableHighlight>
          </View>

          <View w50>
            <TouchableHighlight underlayColor="transparent" style={styles.navigationButton}
                                onPress={() => navigation.navigate('PatientList')}>
              <View>
                <Icon type="MaterialCommunityIcons" name="account-multiple" style={styles.icons} navigation />
                <Text size-auto center>
                  {t('navigation:patient_list')}
                </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight underlayColor="transparent" style={styles.navigationButton}
                                onPress={() => navigation.navigate('MedicalCaseList')}>
              <View>
                <Icon type="MaterialCommunityIcons" name="format-list-checkbox" style={styles.icons} navigation />
                <Text size-auto center>
                  {t('navigation:case_in_progress')}
                </Text>
              </View>
            </TouchableHighlight>
          </View>

          <View w50>
            <TouchableHighlight underlayColor="transparent" style={styles.navigationButton}
                                onPress={() => navigation.navigate('Algorithms')}>
              <View>
                <Icon type="AntDesign" name="sync" style={styles.icons} navigation />
                <Text size-auto center>
                  {t('navigation:synchronize')}
                </Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight underlayColor="transparent" style={styles.navigationButton}
                                onPress={() => navigation.navigate('Settings')}>
              <View>
                <Icon type="AntDesign" name="setting" style={styles.icons} navigation />
                <Text size-auto center>
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
              <View>
                <Icon type="MaterialCommunityIcons" name="account" style={styles.icons} navigation />
                <Text size-auto center>
                  Crash app
                </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight underlayColor="transparent" style={styles.navigationButton}
                                onPress={() => this.logout()}>
              <View>
                <Icon type="AntDesign" name="logout" style={styles.icons} navigation />
                <Text size-auto center>
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

