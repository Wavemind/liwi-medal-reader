// @flow

import * as React from 'react';
import { ScrollView, TouchableHighlight } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { Text, View, Icon } from 'native-base';
import { LiwiTitle2 } from '../../template/layout';
import { styles } from './Home.style';

type Props = NavigationScreenProps & {};
type State = {};

export default class Home extends React.Component<Props, State> {

  logout = async () => {
    const {
      app: { lockSession },
    } = this.props;
    await lockSession();
  };

  render() {
    const {
      navigation,
      app: { t },
    } = this.props;

    return (
      <ScrollView>
        <View padding-auto>
          <LiwiTitle2 noBorder>
            {t('home:title')}
          </LiwiTitle2>
          <View flex-container-column>
            <View w50>
              <TouchableHighlight
                underlayColor="transparent"
                style={styles.navigationButton}
                onPress={() => navigation.navigate('')}
              >
                <View>
                  <Icon
                    type="MaterialCommunityIcons"
                    name="account-search"
                    style={styles.icons}
                    navigation
                  />
                  <Text size-auto center>{t('navigation:patient_search')}</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor="transparent"
                style={styles.navigationButton}
                onPress={() => navigation.navigate('PatientUpsert', { idPatient: null })}
              >
                <View>
                  <Icon
                    type="MaterialCommunityIcons"
                    name="account-plus"
                    style={styles.icons}
                    navigation
                  />
                  <Text size-auto center>{t('navigation:patient_add')}</Text>
                </View>
              </TouchableHighlight>
            </View>

            <View w50>
              <TouchableHighlight
                underlayColor="transparent"
                style={styles.navigationButton}
                onPress={() => navigation.navigate('PatientList')}
              >
                <View>
                  <Icon
                    type="MaterialCommunityIcons"
                    name="account-multiple"
                    style={styles.icons}
                    navigation
                  />
                  <Text size-auto center>{t('navigation:patient_list')}</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor="transparent"
                style={styles.navigationButton}
                onPress={() => navigation.navigate('MedicalCaseList')}
              >
                <View>
                  <Icon
                    type="MaterialCommunityIcons"
                    name="format-list-checkbox"
                    style={styles.icons}
                    navigation
                  />
                  <Text size-auto center>{t('navigation:case_in_progress')}</Text>
                </View>
              </TouchableHighlight>
            </View>

            <View w50>
              <TouchableHighlight
                underlayColor="transparent"
                style={styles.navigationButton}
                onPress={() => navigation.navigate('Algorithm')}
              >
                <View>
                  <Icon
                    type="AntDesign"
                    name="sync"
                    style={styles.icons}
                    navigation
                  />
                  <Text size-auto center>{t('navigation:synchronize')}</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor="transparent"
                style={styles.navigationButton}
                onPress={() => navigation.navigate('Settings')}
              >
                <View>
                  <Icon
                    type="AntDesign"
                    name="setting"
                    style={styles.icons}
                    navigation
                  />
                  <Text size-auto center>{t('navigation:settings')}</Text>
                </View>
              </TouchableHighlight>
            </View>

            <View w50>
              <TouchableHighlight
                underlayColor="transparent"
                style={styles.navigationButton}
                onPress={() => navigation.navigate('')}
              >
                <View>
                  <Icon
                    type="MaterialCommunityIcons"
                    name="account"
                    style={styles.icons}
                    navigation
                  />
                  <Text size-auto center>{t('navigation:my_profile')}</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor="transparent"
                style={styles.navigationButton}
                onPress={() => this.logout()}
              >
                <View>
                  <Icon
                    type="AntDesign"
                    name="logout"
                    style={styles.icons}
                    navigation
                  />
                  <Text size-auto center>{t('navigation:logout')}</Text>
                </View>
              </TouchableHighlight>
            </View>

          </View>
        </View>
      </ScrollView>
    );
  }
}
