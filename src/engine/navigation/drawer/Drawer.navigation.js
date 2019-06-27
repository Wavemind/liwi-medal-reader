import React, { Component } from 'react';
import { AppState, View } from 'react-native';
import { Button, Icon, Text } from 'native-base';

import { styles } from './Drawer.style';
import i18n from '../../../utils/i18n';

export default class Drawer extends Component {
  state = {
    isConnected: false,
    appState: AppState.currentState,
  };

  logout = async () => {
    const {
      app: { lockSession },
    } = this.props;
    await lockSession();
  };

  onPress = (path) => {
    const { navigation } = this.props;
    navigation.navigate( path );
  };

  render() {
    const {
      navigation,
      app: { user },
    } = this.props;

    return (
      <View style={ styles.columns }>
        <View style={ styles.tools }>
          <View style={ styles.top }>
            <Button
              transparent
              btnDrawer
              marginIcon
            >
              <Icon
                style={ styles.icon }
                dark
                type={ 'AntDesign' }
                name="user"
              />
            </Button>

            <Button
              transparent
              btnDrawer
              marginIcon
              onPress={ () => navigation.navigate( 'Settings' ) }
            >
              <Icon
                style={ styles.icon }
                dark
                type={ 'AntDesign' }
                name="setting"
              />
            </Button>

            <Button
              transparent
              btnDrawer
              marginIcon
              onPress={ () => navigation.navigate( 'Algorithms' ) }
            >
              <Icon
                style={ styles.icon }
                dark
                type={ 'AntDesign' }
                name="sync"
              />
            </Button>

          </View>
          <View style={ styles.bottom }>
            <Button transparent btnDrawer onPress={ this.logout }>
              <Icon style={ styles.icon } dark type={ 'AntDesign' } name="logout"/>
            </Button>
          </View>
        </View>

        <View style={ styles.medical }>

          <View style={ [styles.triage, styles.paddingCategory] }>
            <Text style={ styles.title }>{ i18n.t( 'menu:triage' ) }</Text>
            <Button
              transparent
              btnDrawer
              onPress={ () => this.onPress( 'Assessments' ) }

            >
              <Text dark style={ styles.noLeftPadding }>{ i18n.t( 'menu:assessment' ) }</Text>
            </Button>
            <Button
              transparent
              btnDrawer
              onPress={ () => this.onPress( 'VitalSigns' ) }

            >
              <Text dark style={ styles.noLeftPadding }>{ i18n.t( 'menu:vital_signs' ) }</Text>
            </Button>
            <Button
              transparent
              btnDrawer
              onPress={ () => this.onPress( 'Comorbidities' ) }

            >
              <Text dark style={ styles.noLeftPadding }>{ i18n.t( 'menu:comorbidities' ) }</Text>
            </Button>
            <Button
              transparent
              btnDrawer
              onPress={ () => this.onPress( 'Vaccinations' ) }

            >
              <Text dark style={ styles.noLeftPadding }>{ i18n.t( 'menu:vacciantion_history' ) }</Text>
            </Button>
            <Button
              transparent
              btnDrawer
              onPress={ () => this.onPress( 'ChiefComplaints' ) }

            >
              <Text dark style={ styles.noLeftPadding }>{ i18n.t( 'menu:chief_complaint' ) }</Text>
            </Button>
          </View>

          <View style={ [styles.consultation, styles.paddingCategory] }>
            <Text style={ styles.title }>{ i18n.t( 'menu:consultation' ) }</Text>
            <Button
              transparent
              btnDrawer
              onPress={ () => this.onPress( 'MedicalHistory' ) }
            >
              <Text dark style={ styles.noLeftPadding }>{ i18n.t( 'menu:medical_history' ) }</Text>
            </Button>
            <Button
              transparent
              btnDrawer
              onPress={ () => this.onPress( 'PhysicalExams' ) }

            >
              <Text dark style={ styles.noLeftPadding }>{ i18n.t( 'menu:physical_exam' ) }</Text>
            </Button>
            <Button
              transparent
              btnDrawer
              onPress={ () => this.onPress( 'Poct' ) }

            >
              <Text dark style={ styles.noLeftPadding }>{ i18n.t( 'menu:poct' ) }</Text>
            </Button>
          </View>

          <View style={ [styles.tests, styles.paddingCategory] }>
            <Button
              transparent
              btnDrawer
            >
              <Text style={ [styles.title, styles.noLeftPadding] } dark>{ i18n.t( 'menu:tests' ) }</Text>
            </Button>
          </View>

          <View style={ [styles.strategy, styles.paddingCategory] }>
            <Button
              transparent
              btnDrawer
            >
              <Text style={ [styles.title, styles.noLeftPadding] } dark>{ i18n.t( 'menu:strategy' ) }</Text>
            </Button>
          </View>

          <View style={ [styles.patient, styles.paddingCategory] }>
            <Button
              transparent
              btnDrawer
            >
              <Icon
                style={ [styles.icon, { marginLeft: 0 }] }
                white
                name="search"
              />
              <Text white>{ i18n.t( 'menu:search' ) }</Text>
            </Button>
            <Button
              transparent
              btnDrawer
            >
              <Icon
                style={ [styles.icon, { marginLeft: 0 }] }
                white
                name="person"
              />
              <Text white>{ i18n.t( 'menu:add' ) }</Text>
            </Button>
          </View>

        </View>
      </View>
    );
  }
}
