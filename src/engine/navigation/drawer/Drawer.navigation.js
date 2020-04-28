// @flow
import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
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
import { displayNotification } from '../../../utils/CustomToast';
import { renderingDrawerItems } from './Drawer.constants';
import { liwiColors } from '../../../utils/constants';
// eslint-disable-next-line no-unused-vars

type Props = NavigationScreenProps & {};

type State = StateApplicationContext & {};

export default class Drawer extends Component<Props, State> {
  static defaultProps = {
    isDrawer: false,
  };

  state = {
    refParent: null,
  };

  _setScrollPosition = (y) => {
    this.scrollView.scrollTo({ y: y, animated: false });
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

  setRef(scrollView) {
    this.scrollView = scrollView;
  }

  render() {
    const {
      navigation,
      medicalCase,
      app: { t },
      isDrawer,
    } = this.props;

    // Get current route from navigation
    const r = NavigationService.getCurrentRoute();

    // Is redux ready, for disabled buttons
    const areMedicalCaseInredux = medicalCase.id !== undefined;

    const navigate = (name, initialPage) => {
      if (areMedicalCaseInredux) {
        if (name === 'PatientUpsert') {
          navigation.navigate({
            routeName: name,
            params: { initialPage, idPatient: medicalCase?.patient?.id, newMedicalCase: false },
            key: name + initialPage,
          });
        }

        navigation.navigate({
          routeName: name,
          params: { initialPage },
          key: name + initialPage,
        });
      } else {
        displayNotification(t('menu:noredux'), liwiColors.redColor);
      }
    };

    if (r === null) {
      return null;
    }

    // Switch render with enum
    const enumRender = (item, i) => {
      const key = item.type;

      return {
        categorie: (
          <CategorieButton _setScrollPosition={this._setScrollPosition} key={`${key + i}-enum`} areMedicalCaseInredux={areMedicalCaseInredux} navigate={navigate} r={r} {...item} isDrawer={isDrawer} />
        ),
        item: <ItemButton key={`${key + i}-enum`} areMedicalCaseInredux={areMedicalCaseInredux} navigate={navigate} r={r} {...item} isDrawer={isDrawer} />,
        path: <PathBar key={`${key + i}-enum`} areMedicalCaseInredux={areMedicalCaseInredux} navigate={navigate} r={r} {...item} isDrawer={isDrawer} />,
      }[key];
    };

    // Render items
    const renderDrawerButtons = <View style={[styles.top, { opacity: areMedicalCaseInredux ? 1 : 0.3 }]}>{renderingDrawerItems.map((item, i) => enumRender(item, i))}</View>;

    return (
      <ScrollView
        style={{
          elevation: 5,
          backgroundColor: '#f5f5f5',
        }}
        ref={(scrollView) => {
          this.scrollView = scrollView;
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
