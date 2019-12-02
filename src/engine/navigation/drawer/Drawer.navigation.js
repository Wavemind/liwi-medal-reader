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
import { CategorieButton, ItemButton, PathBar } from './Drawer.item.navigation';
import { Toaster } from '../../../utils/CustomToast';

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

    // routing render by objet, more clean
    const renderingDrawerItems = [
      {
        type: 'categorie',
        initialPage: 0,
        name: 'Triage',
        routeName: 'Triage',
        t: t('menu:triage'),
      },
      {
        type: 'path',
        initialPage: 0,
        routeName: 'Triage',
      },
      {
        type: 'item',
        initialPage: 0,
        name: 'Triage',
        routeName: 'Triage',
        t: t('menu:first_look_assessments'),
      },
      {
        type: 'path',
        initialPage: 1,
        routeName: 'Triage',
      },
      {
        type: 'item',
        initialPage: 1,
        name: 'Triage',
        routeName: 'Triage',
        t: t('menu:chief_complaints'),
      },
      {
        type: 'path',
        initialPage: 2,
        routeName: 'Triage',
      },
      {
        type: 'item',
        initialPage: 2,
        name: 'Triage',
        routeName: 'Triage',
        t: t('menu:vital_signs'),
      },
      {
        type: 'categorie',
        initialPage: 0,
        name: 'Consultation',
        routeName: 'Consultation',
        t: t('menu:consultation'),
      },
      {
        type: 'path',
        initialPage: 0,
        routeName: 'Consultation',
      },
      {
        type: 'item',
        initialPage: 0,
        name: 'Consultation',
        routeName: 'Consultation',
        t: t('menu:medical_history'),
      },
      {
        type: 'path',
        initialPage: 1,
        routeName: 'Consultation',
      },
      {
        type: 'item',
        initialPage: 1,
        name: 'Consultation',
        routeName: 'Consultation',
        t: t('menu:physical_exam'),
      },
      {
        type: 'categorie',
        initialPage: 0,
        name: 'Tests',
        routeName: 'Tests',
        t: t('menu:tests'),
      },
      {
        type: 'categorie',
        initialPage: 0,
        name: 'DiagnosticsStrategy',
        routeName: 'DiagnosticsStrategy',
        t: t('menu:strategy'),
      },
    ];

    return (
      <View style={[styles.columns, { width: drawerWidth, padding: 0 }]}>
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
          <View style={[styles.top, { opacity: areMedicalCaseInredux ? 1 : 0.3 }]}>{renderingDrawerItems.map((routeur) => enumRender(routeur))}</View>
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
        </View>
      </View>
    );
  }
}
