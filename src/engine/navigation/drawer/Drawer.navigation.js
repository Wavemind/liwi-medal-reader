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

  shouldComponentUpdate(nextProps: Readonly<P>): boolean {
    const { props } = this;
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

    return (
      <View style={[styles.columns, { width: this.props.drawerWidth, padding: 20 }]}>
        <View style={styles.tools}>
          <View style={styles.top}>
            <Button drawerCategorieButton>
              <Text drawerCategorieText>{t('menu:triage')}</Text>
            </Button>
            <Button drawerItemButton transparent>
              <Icon drawerItemIcon type="Ionicons" name="md-radio-button-off" />
              <Text drawerItemText>{t('menu:first_look_assessments')}</Text>
            </Button>
            <Button drawerItemButton transparent>
              <Icon drawerItemIcon type="Ionicons" name="md-radio-button-off" />
              <Text drawerItemText>{t('menu:chief_complaints')}</Text>
            </Button>
            <Button drawerItemButton transparent>
              <Icon drawerItemIcon type="Ionicons" name="md-radio-button-off" />
              <Text drawerItemText>{t('menu:vital_signs')}</Text>
            </Button>

            <Button drawerCategorieButton>
              <Text drawerCategorieText>{t('menu:consultation')}</Text>
            </Button>
            <Button drawerItemButton transparent>
              <Icon drawerItemIcon type="Ionicons" name="md-radio-button-off" />
              <Text drawerItemText>{t('menu:medical_history')}</Text>
            </Button>
            <Button drawerItemButton transparent>
              <Icon drawerItemIcon type="Ionicons" name="md-radio-button-off" />
              <Text drawerItemText>{t('menu:physical_exam')}</Text>
            </Button>

            <Button drawerCategorieButton>
              <Text drawerCategorieText>{t('menu:tests')}</Text>
            </Button>

            <Button drawerCategorieButton>
              <Text drawerCategorieText>{t('menu:strategy')}</Text>
            </Button>

            <Button
              transparent
              btnDrawer
              marginIcon
              onPress={() => {
                navigation.navigate('Home');
              }}
            >
              <Icon style={styles.icon} dark type="AntDesign" name="home" />
            </Button>

            <Button transparent btnDrawer marginIcon onPress={() => navigation.navigate('Algorithms')}>
              <Icon style={styles.icon} dark type="AntDesign" name="sync" />
            </Button>
          </View>
          <View style={styles.bottom}>
            <Button transparent btnDrawer marginIcon onPress={() => navigation.navigate('Settings')}>
              <Icon style={styles.icon} dark type="AntDesign" name="setting" />
            </Button>
            <Button transparent btnDrawer onPress={this.logout}>
              <Icon style={styles.icon} dark type="AntDesign" name="logout" />
            </Button>
          </View>
        </View>
      </View>
    );
  }
}
