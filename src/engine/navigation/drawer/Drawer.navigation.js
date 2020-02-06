// @flow
import React, { Component } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import styled from 'styled-components';
import { styles } from './Drawer.style';
import type { StateApplicationContext } from '../../contexts/Application.context';
import NavigationService from '../Navigation.service';
import { BottomButtonsDrawer, CategorieButton, HeaderButtonsDrawer, ItemButton, PathBar } from './Drawer.item.navigation';
import { Toaster } from '../../../utils/CustomToast';
import { renderingDrawerItems } from './Drawer.constants';
import { marginLeftDrawer } from '../../../utils/constants';
// eslint-disable-next-line no-unused-vars
import { DrawerMinify } from './Drawer.minify';

type Props = NavigationScreenProps & {};

type State = StateApplicationContext & {};
const Inner = styled.ScrollView`
  elevation: 15;
`;
export default class Drawer extends Component<Props, State> {
  static defaultProps = {
    isDrawer: false,
  };

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
      isDrawer,
    } = this.props;

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
        categorie: <CategorieButton areMedicalCaseInredux={areMedicalCaseInredux} navigate={navigate} r={r} {...item} isDrawer={isDrawer} />,
        item: <ItemButton areMedicalCaseInredux={areMedicalCaseInredux} navigate={navigate} r={r} {...item} isDrawer={isDrawer} />,
        path: <PathBar areMedicalCaseInredux={areMedicalCaseInredux} navigate={navigate} r={r} {...item} isDrawer={isDrawer} />,
      }[key];
    };

    // Render items
    const renderDrawerButtons = (
      <View style={[styles.top, { opacity: areMedicalCaseInredux ? 1 : 0.3 }]}>{renderingDrawerItems.map((item) => enumRender(item))}</View>
    );

    console.log(isDrawer);

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          console.log('pressss');
        }}
      >
        <View
          onStartShouldSetResponder={() => true}
          style={[
            styles.columns,
            {
              width: isDrawer ? drawerWidth : marginLeftDrawer,
              padding: 0,
            },
          ]}
        >
          <Inner contentContainerStyle={{ flexGrow: 1 }} isDrawer={isDrawer} scrollEnabled showsVerticalScrollIndicator>
            <View onStartShouldSetResponder={() => true} style={{ flex: 1 }}>
              {isDrawer && <HeaderButtonsDrawer r={r} />}
              {renderDrawerButtons}
              <BottomButtonsDrawer medicalCase={medicalCase} isDrawer={isDrawer} />
            </View>
          </Inner>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
