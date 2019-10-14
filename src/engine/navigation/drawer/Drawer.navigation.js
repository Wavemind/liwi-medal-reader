// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import { Button, Icon, Text } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import NavigationService from '../Navigation.service';

import { styles } from './Drawer.style';
import type { StateApplicationContext } from '../../contexts/Application.context';

type Props = NavigationScreenProps & {};

type State = StateApplicationContext & {};

export default class Drawer extends Component<Props, State> {
  logout = async () => {
    const {
      app: { lockSession },
    } = this.props;
    await lockSession();
  };

  onPress = (path) => {
    const { navigation } = this.props;
    navigation.navigate(path);
  };

  shouldComponentUpdate(nextProps: Readonly<P>): boolean {
    const { props } = this;
    let b =
      nextProps.medicalCase.id !== props.medicalCase.id ||
      Object.compare(nextProps.navigation, props.navigation);

    return b;
  }

  render() {
    const {
      navigation,
      app: { t },
      medicalCase,
    } = this.props;

    const currentRoute = NavigationService.getCurrentRoute();

    return (
      <View style={styles.columns}>
        <View style={styles.tools}>
          <View style={styles.top}>
            <Button
              transparent
              btnDrawer
              marginIcon
              onPress={() => {
                if (currentRoute?.routeName === 'Home') {
                  navigation.closeDrawer();
                } else {
                  navigation.navigate('Home');
                }
              }}
            >
              <Icon style={styles.icon} dark type="AntDesign" name="home" />
            </Button>

            <Button transparent btnDrawer marginIcon>
              <Icon style={styles.icon} dark type="AntDesign" name="user" />
            </Button>

            <Button
              transparent
              btnDrawer
              marginIcon
              onPress={() => navigation.navigate('Settings')}
            >
              <Icon style={styles.icon} dark type="AntDesign" name="setting" />
            </Button>

            <Button
              transparent
              btnDrawer
              marginIcon
              onPress={() => navigation.navigate('Algorithms')}
            >
              <Icon style={styles.icon} dark type="AntDesign" name="sync" />
            </Button>
          </View>
          <View style={styles.bottom}>
            <Button transparent btnDrawer onPress={this.logout}>
              <Icon style={styles.icon} dark type="AntDesign" name="logout" />
            </Button>
          </View>
        </View>
        {medicalCase.id !== undefined ? (
          <View style={styles.medical}>
            <View style={[styles.triage, styles.paddingCategory]}>
              <Text style={styles.title}>{t('menu:triage')}</Text>

              <Button
                transparent
                btnDrawer
                onPress={() =>
                  navigation.navigate({
                    routeName: 'Triage',
                    params: { initialPage: 0 },
                    key: 'Triage' + 0,
                  })
                }
              >
                <Text dark style={styles.noLeftPadding}>
                  {t('menu:first_look_assessments')}
                </Text>
              </Button>
              <Button
                transparent
                btnDrawer
                onPress={() =>
                  navigation.navigate({
                    routeName: 'Triage',
                    params: { initialPage: 1 },
                    key: 'Triage' + 1,
                  })
                }
              >
                <Text dark style={styles.noLeftPadding}>
                  {t('menu:chief_complaints')}
                </Text>
              </Button>
              <Button
                transparent
                btnDrawer
                onPress={() =>
                  navigation.navigate({
                    routeName: 'Triage',
                    params: { initialPage: 2 },
                    key: 'Triage' + 2,
                  })
                }
              >
                <Text dark style={styles.noLeftPadding}>
                  {t('menu:vital_signs')}
                </Text>
              </Button>
            </View>

            <View style={[styles.consultation, styles.paddingCategory]}>
              <Text style={styles.title}>{t('menu:consultation')}</Text>
              <Button
                transparent
                btnDrawer
                onPress={() =>
                  navigation.navigate({
                    routeName: 'Consultation',
                    params: { initialPage: 0 },
                    key: 'Consultation' + 0,
                  })
                }
              >
                <Text dark style={styles.noLeftPadding}>
                  {t('menu:medical_history')}
                </Text>
              </Button>
              <Button
                transparent
                btnDrawer
                onPress={() =>
                  navigation.navigate({
                    routeName: 'Consultation',
                    params: { initialPage: 1 },
                    key: 'Consultation' + 1,
                  })
                }
              >
                <Text dark style={styles.noLeftPadding}>
                  {t('menu:physical_exam')}
                </Text>
              </Button>
            </View>
            <View style={[styles.tests, styles.paddingCategory]}>
              <Button
                transparent
                btnDrawer
                onPress={() => this.onPress('Tests')}
              >
                <Text style={[styles.title, styles.noLeftPadding]} dark>
                  {t('menu:tests')}
                </Text>
              </Button>
            </View>

            <View style={[styles.strategy, styles.paddingCategory]}>
              <Button
                transparent
                btnDrawer
                onPress={() => this.onPress('DiagnosticsStrategy')}
              >
                <Text style={[styles.title, styles.noLeftPadding]} dark>
                  {t('menu:strategy')}
                </Text>
              </Button>
            </View>

            <View style={[styles.patient, styles.paddingCategory]}>
              <Button transparent btnDrawer>
                <Icon
                  style={[styles.icon, styles.margin0]}
                  white
                  name="search"
                  onPress={() => this.onPress('PatientList')}
                />
                <Text white>{t('menu:search')}</Text>
              </Button>
              <Button transparent btnDrawer>
                <Icon
                  style={[styles.icon, styles.margin0]}
                  white
                  name="person"
                  onPress={() => this.onPress('PatientUpsert')}
                />
                <Text white>{t('menu:add')}</Text>
              </Button>
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}
