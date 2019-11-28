// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import { Button, Icon, Text } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import _ from 'lodash';
import { styles } from './Drawer.style';
import type { StateApplicationContext } from '../../contexts/Application.context';
import NavigationService from '../Navigation.service';
import { liwiColors } from '../../../utils/constants';
import { medicalCaseStatus } from '../../../../frontend_service/constants';

type Props = NavigationScreenProps & {};

type State = StateApplicationContext & {};

// Keep it when we refractor dynamic drawer
const isActiveStep = (step, status) => {
  let currentStatus = _.find(medicalCaseStatus, (i) => {
    return i.name === status;
  });

  let findStep = _.find(medicalCaseStatus, (i) => {
    return i.name === step;
  });
  return currentStatus.index > findStep.index;
};

export const PathBar = ({ active }) => {
  return (
    <View style={{ marginTop: -3, marginBottom: -3 }}>
      <View style={{ backgroundColor: active ? liwiColors.redColor : liwiColors.greyColor, width: 3, height: 30, marginLeft: 13 }} />
    </View>
  );
};

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
    return true;
    let b =
      nextProps.medicalCase.id !== props.medicalCase.id ||
      nextProps.medicalCase.isCreating !== props.medicalCase.isCreating ||
      Object.compare(nextProps.navigation, props.navigation);

    return b;
  }

  render() {
    const {
      navigation,
      app: { t },
      medicalCase,
    } = this.props;

    /**
     *  onPress={() =>
                  navigation.navigate({
                    routeName: 'Triage',
                    params: { initialPage: 0 },
                    key: 'Triage' + 0,
                  })
                }
     *
     */

    let r = NavigationService.getCurrentRoute();

    console.log(r);

    return (
      <View style={[styles.columns, { width: this.props.drawerWidth, padding: 0 }]}>
        <View style={styles.tools}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: liwiColors.redColor }}>
            <Button
              transparent
              style={{
                alignSelf: 'flex-start',
              }}
              homeDrawer
              onPress={() => {
                if (r.routeName === 'Home') {
                  navigation.toggleDrawer();
                }
                navigation.navigate('Home');
              }}
            >
              <Icon style={styles.iconTop} dark type="FontAwesome" name="home" />
            </Button>
            <Button
              transparent
              style={{
                alignSelf: 'flex-end',
              }}
              homeDrawer
              onPress={() => {
                navigation.toggleDrawer();
              }}
            >
              <Icon style={styles.iconTop} dark type="AntDesign" name="close" />
            </Button>
          </View>
          <View style={styles.top}>
            <Button
              onPress={() =>
                navigation.navigate({
                  routeName: 'Triage',
                  params: { initialPage: 0 },
                  key: 'Triage' + 0,
                })
              }
              drawerCategorieButton
              style={[r.routeName === 'Triage' ? styles.activeButtonCategorie : null]}
            >
              <Text drawerCategorieText style={[r.routeName === 'Triage' ? null : styles.activeTextcategorie]}>
                {t('menu:triage')}
              </Text>
            </Button>
            <PathBar active={r?.params?.initialPage >= 0 && r.routeName === 'Triage'} />
            <Button
              onPress={() =>
                navigation.navigate({
                  routeName: 'Triage',
                  params: { initialPage: 0 },
                  key: 'Triage' + 1,
                })
              }
              drawerItemButton
              transparent
            >
              <Icon
                drawerItemIcon
                style={r?.params?.initialPage >= 0 && r.routeName === 'Triage' ? styles.activeLink : null}
                type="Ionicons"
                name={r?.params?.initialPage >= 0 && r.routeName === 'Triage' ? 'md-radio-button-on' : 'md-radio-button-off'}
              />
              <Text drawerItemText style={r?.params?.initialPage >= 0 && r.routeName === 'Triage' ? styles.activeLink : null}>
                {t('menu:first_look_assessments')}
              </Text>
            </Button>
            <PathBar active={r?.params?.initialPage >= 1 && r.routeName === 'Triage'} />
            <Button
              onPress={() =>
                navigation.navigate({
                  routeName: 'Triage',
                  params: { initialPage: 1 },
                  key: 'Triage' + 2,
                })
              }
              drawerItemButton
              transparent
            >
              <Icon
                style={r?.params?.initialPage >= 1 && r.routeName === 'Triage' ? styles.activeLink : null}
                drawerItemIcon
                type="Ionicons"
                name={r?.params?.initialPage >= 1 && r.routeName === 'Triage' ? 'md-radio-button-on' : 'md-radio-button-off'}
              />
              <Text style={r?.params?.initialPage >= 1 && r.routeName === 'Triage' ? styles.activeLink : null} drawerItemText>
                {t('menu:chief_complaints')}
              </Text>
            </Button>
            <PathBar active={r?.params?.initialPage >= 2 && r.routeName === 'Triage'} />
            <Button
              onPress={() =>
                navigation.navigate({
                  routeName: 'Triage',
                  params: { initialPage: 2 },
                  key: 'Triage' + 3,
                })
              }
              drawerItemButton
              transparent
            >
              <Icon
                style={r?.params?.initialPage >= 2 && r.routeName === 'Triage' ? styles.activeLink : null}
                drawerItemIcon
                type="Ionicons"
                name={r?.params?.initialPage >= 2 && r.routeName === 'Triage' ? 'md-radio-button-on' : 'md-radio-button-off'}
              />
              <Text style={r?.params?.initialPage >= 2 && r.routeName === 'Triage' ? styles.activeLink : null} drawerItemText>
                {t('menu:vital_signs')}
              </Text>
            </Button>
            <Button
              onPress={() =>
                navigation.navigate({
                  routeName: 'Consultation',
                  params: { initialPage: 0 },
                  key: 'Consultation' + 1,
                })
              }
              drawerCategorieButton
              style={[r.routeName === 'Consultation' ? styles.activeButtonCategorie : null]}
            >
              <Text drawerCategorieText style={[r.routeName === 'Consultation' ? null : styles.activeTextcategorie]}>
                {t('menu:consultation')}
              </Text>
            </Button>
            <PathBar active={r?.params?.initialPage >= 0 && r.routeName === 'Consultation'} />
            <Button
              onPress={() =>
                navigation.navigate({
                  routeName: 'Consultation',
                  params: { initialPage: 0 },
                  key: 'Consultation' + 1,
                })
              }
              drawerItemButton
              transparent
            >
              <Icon
                style={r?.params?.initialPage >= 0 && r.routeName === 'Consultation' ? styles.activeLink : null}
                drawerItemIcon
                type="Ionicons"
                name={r?.params?.initialPage >= 0 && r.routeName === 'Consultation' ? 'md-radio-button-on' : 'md-radio-button-off'}
              />
              <Text style={r?.params?.initialPage >= 0 && r.routeName === 'Consultation' ? styles.activeLink : null} drawerItemText>
                {t('menu:medical_history')}
              </Text>
            </Button>
            <PathBar active={r?.params?.initialPage >= 1 && r.routeName === 'Consultation'} />
            <Button
              onPress={() =>
                navigation.navigate({
                  routeName: 'Consultation',
                  params: { initialPage: 1 },
                  key: 'Consultation' + 1,
                })
              }
              drawerItemButton
              transparent
            >
              <Icon
                style={r?.params?.initialPage >= 1 && r.routeName === 'Consultation' ? styles.activeLink : null}
                drawerItemIcon
                type="Ionicons"
                name={r?.params?.initialPage >= 1 && r.routeName === 'Consultation' ? 'md-radio-button-on' : 'md-radio-button-off'}
              />
              <Text style={r?.params?.initialPage >= 1 && r.routeName === 'Consultation' ? styles.activeLink : null} drawerItemText>
                {t('menu:physical_exam')}
              </Text>
            </Button>
            <Button onPress={() => navigation.navigate('Tests')} drawerCategorieButton style={[r.routeName === 'Tests' ? styles.activeButtonCategorie : null]}>
              <Text drawerCategorieText style={[r.routeName === 'Tests' ? null : styles.activeTextcategorie]}>
                {t('menu:tests')}
              </Text>
            </Button>
            <Button
              onPress={() => navigation.navigate('DiagnosticsStrategy')}
              drawerCategorieButton
              style={[r.routeName === 'DiagnosticsStrategy' ? styles.activeButtonCategorie : null]}
            >
              <Text drawerCategorieText style={[r.routeName === 'DiagnosticsStrategy' ? null : styles.activeTextcategorie]}>
                {t('menu:strategy')}
              </Text>
            </Button>
            <Button transparent btnDrawer marginIcon onPress={() => navigation.navigate('Algorithms')}>
              <Icon style={styles.icon} dark type="AntDesign" name="sync" />
            </Button>
          </View>
          <View style={styles.bottom}>
            <Button
              style={styles.bottomStyle}
              marginIcon
              onPress={() =>
                navigation.navigate('Summary', {
                  id: medicalCase.patient.id,
                  defaultTab: 0,
                })
              }
            >
              <Icon style={{ fontSize: 40 }} drawerBottomIcon type="AntDesign" name="setting" />
              <Text style={styles.textBottom}>Current Summary</Text>
            </Button>
            <Button style={styles.bottomStyle} onPress={() => navigation.navigate('Emergency')}>
              <Icon style={{ fontSize: 40 }} drawerBottomIcon name="warning" type="FontAwesome" />
              <Text style={styles.textBottom}>Emergency</Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }
}
