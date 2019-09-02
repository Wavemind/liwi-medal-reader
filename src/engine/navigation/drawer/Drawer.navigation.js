// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import { Button, Icon, Text } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';

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

  render() {
    const {
      navigation,
      app: { t },
      medicalCase,
    } = this.props;

    return (
      <View style={styles.columns}>
        <View style={styles.tools}>
          <View style={styles.top}>
            <Button transparent btnDrawer marginIcon>
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
                onPress={() => this.onPress('FirstLookAssessments')}
              >
                <Text dark style={styles.noLeftPadding}>
                  {t('menu:assessment')}
                </Text>
              </Button>
              <Button
                transparent
                btnDrawer
                onPress={() => this.onPress('ChiefComplaints')}
              >
                <Text dark style={styles.noLeftPadding}>
                  {t('menu:chief_complaint')}
                </Text>
              </Button>
              <Button
                transparent
                btnDrawer
                onPress={() => this.onPress('VitalSigns')}
              >
                <Text dark style={styles.noLeftPadding}>
                  {t('menu:vital_signs')}
                </Text>
              </Button>
              <Button
                transparent
                btnDrawer
                onPress={() => this.onPress('Comorbidities')}
              >
                <Text dark style={styles.noLeftPadding}>
                  {t('menu:comorbidities')}
                </Text>
              </Button>
              <Button
                transparent
                btnDrawer
                onPress={() => this.onPress('Vaccinations')}
              >
                <Text dark style={styles.noLeftPadding}>
                  {t('menu:vacciantion_history')}
                </Text>
              </Button>
            </View>

            <View style={[styles.consultation, styles.paddingCategory]}>
              <Text style={styles.title}>{t('menu:consultation')}</Text>
              <Button
                transparent
                btnDrawer
                onPress={() => this.onPress('MedicalHistory')}
              >
                <Text dark style={styles.noLeftPadding}>
                  {t('menu:medical_history')}
                </Text>
              </Button>
              <Button
                transparent
                btnDrawer
                onPress={() => this.onPress('PhysicalExam')}
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
              <Button transparent btnDrawer>
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
