// @Flow
import React, { Component } from 'react';
import { Button, Icon, Text } from 'native-base';
import { TouchableOpacity, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import { styles } from './Drawer.style';
import { liwiColors } from '../../../utils/constants';

export class CategorieButton extends Component<{ t: any, r: any }> {
  // Update the component only when needed
  shouldComponentUpdate(nextProps) {
    let { r, areMedicalCaseInredux, routeName } = this.props;

    if (areMedicalCaseInredux !== nextProps.areMedicalCaseInredux) {
      return true;
    }

    if (nextProps.r?.routeName !== r?.routeName && nextProps.routeName === routeName) {
      return true;
    }

    return false;
  }

  render() {
    let { t, r, name, initialPage, navigate } = this.props;
    return (
      <Button onPress={() => navigate(name, initialPage)} drawerCategorieButton style={[r.routeName === name ? styles.activeButtonCategorie : null]}>
        <Text drawerCategorieText style={[r.routeName === name ? null : styles.activeTextcategorie]}>
          {t}
        </Text>
      </Button>
    );
  }
}

export class ItemButton extends Component<{ t: any, r: any }> {
  // Update the component only when needed
  shouldComponentUpdate(nextProps) {
    let { r, routeName, areMedicalCaseInredux } = this.props;

    if (areMedicalCaseInredux !== nextProps.areMedicalCaseInredux) {
      return true;
    }

    // Juste arrive here
    if (nextProps.r?.routeName === routeName && r?.routeName !== routeName) {
      return true;
    }

    // Route we want and only initialPage not the same
    if (nextProps.r?.routeName === routeName && r?.params?.initialPage !== nextProps.r?.params?.initialPage) {
      return true;
    }

    //
    if (routeName === r.routeName && nextProps.r?.routeName !== r?.routeName) {
      return true;
    }

    return false;
  }

  render() {
    let { t, r, initialPage, name, navigate } = this.props;
    return (
      <Button onPress={() => navigate(name, initialPage)} drawerItemButton transparent>
        <Icon
          drawerItemIcon
          style={r?.params?.initialPage >= initialPage && r.routeName === name ? styles.activeLink : null}
          type="Ionicons"
          name={r?.params?.initialPage >= initialPage && r.routeName === name ? 'md-radio-button-on' : 'md-radio-button-off'}
        />
        <Text drawerItemText style={r?.params?.initialPage >= initialPage && r.routeName === name ? styles.activeLink : null}>
          {t}
        </Text>
      </Button>
    );
  }
}
export const HeaderButtonsDrawer = withNavigation(
  class Header extends React.Component {
    // Update the component only when needed
    shouldComponentUpdate(nextProps) {
      const { areMedicalCaseInredux } = this.props;

      if (areMedicalCaseInredux !== nextProps.areMedicalCaseInredux) {
        return true;
      }

      return this.props?.r?.routeName !== nextProps.r?.routeName;
    }

    render() {
      const { r, navigation } = this.props;

      return (
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
            onPress={() => navigation.navigate('Emergency')}
          >
            <Icon style={styles.iconTop} dark type="FontAwesome5" name="plus-square" />
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
      );
    }
  }
);

export const BottomButtonsDrawer = withNavigation(
  class BottomButtonsDrawerClasse extends React.Component {
    // Update the component only when needed
    shouldComponentUpdate(nextProps) {
      const { areMedicalCaseInredux } = this.props;
      if (areMedicalCaseInredux !== nextProps.areMedicalCaseInredux) {
        return true;
      }
      return nextProps?.medicalCase?.patient?.id !== this.props?.medicalCase?.patient?.id;
    }

    render() {
      const { navigation, medicalCase } = this.props;
      return (
        <View style={styles.bottom}>
          <Button
            marginIcon
            style={styles.bottomStyle}
            onPress={() =>
              navigation.navigate('Summary', {
                id: medicalCase.patient.id,
                defaultTab: 0,
              })
            }
          >
            <Icon style={{ fontSize: 40 }} drawerBottomIcon type="FontAwesome5" name="file-medical" />
            <Text style={styles.textBottom}>Current Summary</Text>
          </Button>
        </View>
      );
    }
  }
);

export class PathBar extends Component<{ routeName: string, initialPage: string }> {
  shouldComponentUpdate(nextProps) {
    let { r, routeName, areMedicalCaseInredux } = this.props;

    if (areMedicalCaseInredux !== nextProps.areMedicalCaseInredux) {
      return true;
    }

    // Juste arrive here
    if (nextProps.r?.routeName === routeName && r?.routeName !== routeName) {
      return true;
    }

    // Route we want and only initialPage not the same
    if (nextProps.r?.routeName === routeName && r?.params?.initialPage !== nextProps.r?.params?.initialPage) {
      return true;
    }

    //
    if (routeName === r.routeName && nextProps.r?.routeName !== r?.routeName) {
      return true;
    }

    return false;
  }

  render() {
    let { r, routeName, initialPage, navigate } = this.props;
    let active = r?.params?.initialPage >= initialPage && r.routeName === routeName;
    return (
      <TouchableOpacity onPress={() => navigate(routeName, initialPage)} style={{ marginTop: -2, marginBottom: -3, flex: 1, flexDirection: 'row' }}>
        <View
          style={{
            flex: 1,
            borderLeftWidth: 3,
            borderLeftColor: active ? liwiColors.redColor : liwiColors.greyColor,
            marginLeft: 14,
          }}
        />
      </TouchableOpacity>
    );
  }
}
