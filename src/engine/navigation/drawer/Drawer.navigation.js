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
import { BottomButtonsDrawer, CategorieButton, HeaderButtonsDrawer, ItemButton, PathBar } from './Drawer.item.navigation';
import { Toaster } from '../../../utils/CustomToast';
import { renderingDrawerItems } from './Drawer.constants';

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
      drawerWidth,
    } = this.props;

    let r = NavigationService.getCurrentRoute();
    const areMedicalCaseInredux = medicalCase.id !== undefined;

    const navigate = (name, initialPage) => {
      if (areMedicalCaseInredux) {
        navigation.navigate({
          routeName: name,
          params: { initialPage: initialPage },
          key: name + initialPage,
        });
      }
    };

    // Switch render with enum
    const enumRender = (item) => {
      const key = item.type;
      return {
        categorie: <CategorieButton navigate={navigate} r={r} {...item} />,
        item: <ItemButton navigate={navigate} r={r} {...item} />,
        path: <PathBar navigate={navigate} r={r} {...item} />,
      }[key];
    };

    const renderDrawerButtons = (
      <View style={[styles.top, { opacity: areMedicalCaseInredux ? 1 : 0.3 }]}>{renderingDrawerItems.map((routeur) => enumRender(routeur))}</View>
    );

    return (
      <View style={[styles.columns, { width: drawerWidth, padding: 0 }]}>
        <View style={styles.tools}>
          <HeaderButtonsDrawer r={r} />
          {renderDrawerButtons}
          <BottomButtonsDrawer medicalCase={medicalCase} />
        </View>
      </View>
    );
  }
}
