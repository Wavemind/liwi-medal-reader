// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { styles } from './Drawer.style';
import type { StateApplicationContext } from '../../contexts/Application.context';
import NavigationService from '../Navigation.service';
import {
  BottomButtonsDrawer,
  CategorieButton,
  HeaderButtonsDrawer,
  ItemButton,
  PathBar,
} from './Drawer.item.navigation';
import { Toaster } from '../../../utils/CustomToast';
import { renderingDrawerItems } from './Drawer.constants';
import { marginLeftDrawer } from '../../../utils/constants';
// eslint-disable-next-line no-unused-vars

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
      medicalCase,
      drawerWidth,
      app: { t },
    } = this.props;

    // eslint-disable-next-line no-unused-vars
    const { isDrawerOpen } = navigation.state;

    // Get current route from navigation
    let r = NavigationService.getCurrentRoute();

    // Is redux ready, for disabled buttons
    const areMedicalCaseInredux = medicalCase.id !== undefined;

    const navigate = (name, initialPage) => {
      if (areMedicalCaseInredux) {
        navigation.navigate({
          routeName: name,
          params: { initialPage: initialPage },
          key: name + initialPage,
        });
      } else {
        Toaster(t('menu:noredux'), {
          type: 'warning',
          duration: 5000,
        });
      }
    };

    // Switch render with enum
    const enumRender = (item) => {
      const key = item.type;
      return {
        categorie: <CategorieButton areMedicalCaseInredux={areMedicalCaseInredux} navigate={navigate} r={r} {...item} />,
        item: <ItemButton areMedicalCaseInredux={areMedicalCaseInredux} navigate={navigate} r={r} {...item} />,
        path: <PathBar areMedicalCaseInredux={areMedicalCaseInredux} navigate={navigate} r={r} {...item} />,
      }[key];
    };

    // Render items
    const renderDrawerButtons = (
      <View style={[styles.top, { opacity: areMedicalCaseInredux ? 1 : 0.3 }]}>{renderingDrawerItems.map((item) => enumRender(item))}</View>
    );

    return (
      <View style={[styles.columns, { width: drawerWidth + marginLeftDrawer, padding: 0 }]}>
        <View style={styles.tools}>
          <HeaderButtonsDrawer r={r} />
          {renderDrawerButtons}
          <BottomButtonsDrawer medicalCase={medicalCase} />

          {/*<DrawerMinify />*/}
          {/*{!isDrawerOpen ? (*/}
          {/*  <DrawerMinify />*/}
          {/*) : (*/}
          {/*  <>*/}

          {/*  </>*/}
          {/*)}*/}
        </View>
      </View>
    );
  }
}
