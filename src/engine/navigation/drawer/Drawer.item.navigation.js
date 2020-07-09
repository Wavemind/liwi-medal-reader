// @Flow
import React, { Component } from 'react';
import { Button, Icon, Text } from 'native-base';
import { TouchableOpacity, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import styled from 'styled-components';
import { styles } from './Drawer.style';
import { liwiColors } from '../../../utils/constants';
import DrawerDot from './Drawer.dot';

// TODO: REFACTOR THIS SHIT
// TODO: REFACTOR THIS SHIT
// TODO: REFACTOR THIS SHIT
// TODO: REFACTOR THIS SHIT

const WrapperMiniDrawerCategory = styled.TouchableOpacity`
  padding: ${({ isDrawer }) => (isDrawer ? '13px 0' : '6px 0')};
  height: ${({ isDrawer }) => (isDrawer ? 'auto' : '200px')};
  width: ${({ isDrawer }) => (isDrawer ? 'auto' : '30px')};
  margin-top: 10px;
  margin-left: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  background-color: ${({ active }) => (active ? '#db473e' : '#e1e1e1')};
  flex: 1;
`;

const SmallText = styled.Text`
  color: ${({ active }) => (active ? '#ffffff' : '#3f3f3f')};
  text-align: center;
  text-transform: uppercase;
  font-size: ${({ isDrawer }) => (isDrawer ? '23px' : '21px')};
  line-height: ${({ isDrawer }) => (isDrawer ? '27px' : '25px')};
  font-family: Roboto-Medium;
  transform: ${({ isDrawer }) => (isDrawer ? 'rotate(0deg)' : 'rotate(-90deg)')};
  width: ${({ isDrawer }) => (isDrawer ? 'auto' : '195px')};
  flex: 1;
`;

export class CategorieButton extends Component<{ t: any, r: any }> {
  // Update the component only when needed
  shouldComponentUpdate(nextProps) {
    const { r, areMedicalCaseInredux, routeName, isDrawer } = this.props;

    if (isDrawer !== nextProps.isDrawer) {
      return true;
    }

    if (areMedicalCaseInredux !== nextProps.areMedicalCaseInredux) {
      return true;
    }

    if (nextProps.r?.routeName !== r?.routeName && nextProps.routeName === routeName) {
      return true;
    }

    return false;
  }

  render() {
    const { t, r, name, initialPage, navigate, isDrawer, _setScrollPosition, refParent } = this.props;

    // Small drawer
    if (!isDrawer) {
      return (
        <WrapperMiniDrawerCategory
          ref={(button) => (this.button = button)}
          onLayout={({ nativeEvent }) => {
            // Set scrollView Y if active
            if (r.routeName === name) {
              _setScrollPosition(nativeEvent.layout.y);
            }
          }}
          active={r.routeName === name}
          isDrawer={isDrawer}
          onStartShouldSetResponder={() => true}
          onPress={() => navigate(name, initialPage)}
        >
          <SmallText isDrawer={isDrawer} active={r.routeName === name} numberOfLines={isDrawer ? 5 : 1}>
            {t}
          </SmallText>
        </WrapperMiniDrawerCategory>
      );
    }
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
    const { r, routeName, areMedicalCaseInredux, isDrawer } = this.props;

    if (isDrawer !== nextProps.isDrawer) {
      return true;
    }

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
    const { t, r, initialPage, name, navigate, isDrawer } = this.props;

    let dotType;

    if (r?.params?.initialPage >= initialPage && r.routeName === name) {
      dotType = 'active';
    }

    return (
      <Button onPress={() => navigate(name, initialPage)} drawerItemButton transparent>
        <DrawerDot type={dotType} onPress={() => navigate(name, initialPage)} isDrawer={isDrawer} />
        {isDrawer ? (
          <Text drawerItemText style={r?.params?.initialPage >= initialPage && r.routeName === name ? styles.activeLink : null}>
            {t}
          </Text>
        ) : null}
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: liwiColors.redColor }} onStartShouldSetResponder={() => true}>
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
      const { areMedicalCaseInredux, isDrawer } = this.props;

      if (isDrawer !== nextProps.isDrawer) {
        return true;
      }

      if (areMedicalCaseInredux !== nextProps.areMedicalCaseInredux) {
        return true;
      }
      return nextProps?.medicalCase?.patient?.id !== this.props?.medicalCase?.patient?.id;
    }

    render() {
      const { navigation, medicalCase, isDrawer } = this.props;
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
            {isDrawer && <Text style={styles.textBottom}>Current Summary</Text>}
          </Button>
        </View>
      );
    }
  }
);

export class PathBar extends Component<{ routeName: string, initialPage: string }> {
  shouldComponentUpdate(nextProps) {
    const { r, routeName, areMedicalCaseInredux, isDrawer } = this.props;

    if (areMedicalCaseInredux !== nextProps.areMedicalCaseInredux) {
      return true;
    }

    if (isDrawer !== nextProps.isDrawer) {
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
    const { r, routeName, initialPage, navigate, isDrawer } = this.props;
    const active = r?.params?.initialPage >= initialPage && r.routeName === routeName;

    return (
      <TouchableOpacity onPress={() => navigate(routeName, initialPage)} style={{ marginTop: 2, marginBottom: 0, flex: 1, flexDirection: 'row' }} onStartShouldSetResponder={() => true}>
        <View
          style={{
            flex: 1,
            borderLeftWidth: 3,
            borderLeftColor: active ? liwiColors.redColor : liwiColors.greyColor,
            marginLeft: isDrawer ? 19 : 24,
            height: isDrawer ? 'auto' : 20,
          }}
        />
      </TouchableOpacity>
    );
  }
}
