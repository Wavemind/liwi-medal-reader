// @flow
import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { styles } from './Drawer.style';
import type { StateApplicationContext } from '../../contexts/Application.context';
import NavigationService from '../Navigation.service';
import { BottomButtonsDrawer, CategorieButton, HeaderButtonsDrawer, ItemButton, PathBar } from './Drawer.item.navigation';
import { Toaster } from '../../../utils/CustomToast';
import { renderingDrawerItems } from './Drawer.constants';

type Props = NavigationScreenProps & {};

type State = StateApplicationContext & {};

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

    if (r === null) {
      return null;
    }

    // Switch render with enum
    const enumRender = (item, i) => {
      const key = item.type;

      return {
        categorie: <CategorieButton key={key + i + '-enum'} areMedicalCaseInredux={areMedicalCaseInredux} navigate={navigate} r={r} {...item}  isDrawer={isDrawer} />,
        item: <ItemButton key={key + i + '-enum'} areMedicalCaseInredux={areMedicalCaseInredux} navigate={navigate} r={r} {...item}  isDrawer={isDrawer} />,
        path: <PathBar key={key + i + '-enum'} areMedicalCaseInredux={areMedicalCaseInredux} navigate={navigate} r={r} {...item}  isDrawer={isDrawer} />,
      }[key];
    };

    // Render items
    const renderDrawerButtons = (
      <View style={[styles.top, { opacity: areMedicalCaseInredux ? 1 : 0.3 }]}>{renderingDrawerItems.map((item, i) => enumRender(item, i))}</View>
    );

    return (
      <ScrollView
        style={{
          elevation: 5,
          backgroundColor: '#f5f5f5',
        }}
        contentContainerStyle={{ flexGrow: 1, zIndex: 10000 }}
        isDrawer={isDrawer}
        scrollEnabled
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          {isDrawer && <HeaderButtonsDrawer r={r} />}
          {renderDrawerButtons}
          <BottomButtonsDrawer medicalCase={medicalCase} isDrawer={isDrawer} />
        </View>
      </ScrollView>
    );
  }
}
