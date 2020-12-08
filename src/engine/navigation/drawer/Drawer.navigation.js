// @flow
import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { styles } from './Drawer.style';
import NavigationService from '../Navigation.service';
import { BottomButtonsDrawer, CategorieButton, HeaderButtonsDrawer, ItemButton, PathBar } from './Drawer.item.navigation';
import { displayNotification } from '../../../utils/CustomToast';
import { armControlRenderingDrawerItems, renderingDrawerItems } from './Drawer.constants';
import { liwiColors } from '../../../utils/constants';

export default class Drawer extends Component {
  static defaultProps = {
    isDrawer: false,
  };

  _setScrollPosition = (y) => {
    this.scrollView.scrollTo({ y, animated: false });
  };

  onPress = (path) => {
    const { navigation } = this.props;
    navigation.navigate(path);
  };

  render() {
    const {
      navigation,
      medicalCase,
      app: { t, algorithm },
      isDrawer,
    } = this.props;

    // Get current route from navigation
    const currentRoute = NavigationService.getCurrentRoute();

    // Is redux ready, for disabled buttons
    const isMedicalCaseLoaded = medicalCase.id !== undefined && !medicalCase?.isNewCase;

    const navigate = (name, initialPage) => {
      if (isMedicalCaseLoaded) {
        if (name === 'PatientUpsert') {
          navigation.navigate({
            routeName: name,
            params: { initialPage, idPatient: medicalCase?.patient_id, newMedicalCase: false },
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

    if (currentRoute === null) {
      return null;
    }

    // Switch render with enum
    const enumRender = (item, i) => {
      const key = item.type;

      return {
        categorie: (
          <CategorieButton _setScrollPosition={this._setScrollPosition} key={`${key + i}-enum`} isMedicalCaseLoaded={isMedicalCaseLoaded} navigate={navigate} r={currentRoute} {...item} isDrawer={isDrawer} />
        ),
        item: <ItemButton key={`${key + i}-enum`} isMedicalCaseLoaded={isMedicalCaseLoaded} navigate={navigate} r={currentRoute} {...item} isDrawer={isDrawer} />,
        path: <PathBar key={`${key + i}-enum`} isMedicalCaseLoaded={isMedicalCaseLoaded} navigate={navigate} r={currentRoute} {...item} isDrawer={isDrawer} />,
      }[key];
    };

    const drawerItems = algorithm.is_arm_control ? armControlRenderingDrawerItems : renderingDrawerItems;

    // Render items
    const renderDrawerButtons = <View style={[styles.top, { opacity: isMedicalCaseLoaded ? 1 : 0.3 }]}>{drawerItems.map((item, i) => enumRender(item, i))}</View>;

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
          {isDrawer && <HeaderButtonsDrawer r={currentRoute} />}
          {renderDrawerButtons}
          <BottomButtonsDrawer medicalCase={medicalCase} isDrawer={isDrawer} />
        </View>
      </ScrollView>
    );
  }
}
