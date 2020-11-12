import React, { Component } from 'react';
import { Button, Fab, Icon, View } from 'native-base';
import RNRestart from 'react-native-restart';
import Realm from 'realm';

import { clearLocalStorage, getItem, getItems } from '../engine/api/LocalStorage';
import NavigationService from '../engine/navigation/Navigation.service';
import { persistor, store } from '../../frontend_service/store';
import { memorySizeOf } from './swissKnives';
import { PatientModel } from '../../frontend_service/helpers/Patient.model';
import { MedicalCaseModel } from '../../frontend_service/helpers/MedicalCase.model';
import Database from '../engine/api/Database';
import { patientTemplate } from './template/PatientTemplate';
import { displayNotification } from './CustomToast';
import { liwiColors } from './constants';

export default class WavemindTools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
  }

  generatePatients = async () => {
    const entryAmount = 10;
    let i = 0;
    for (i = 0; i < entryAmount; i++) {
      const patient = await patientTemplate();
      const database = await new Database();
      await database.insert('Patient', patient);
    }
    displayNotification(`Successfully created ${entryAmount} entries`, liwiColors.greenColor);
  };

  render() {
    const { active } = this.state;

    return (
      <View>
        <Fab active={active} direction="up" containerStyle={{}} style={{ backgroundColor: '#ffb21d', margin: 20 }} position="bottomLeft" onPress={() => this.setState({ active: !active })}
        >
          <Icon name="developer-mode" type="MaterialIcons" />
          {active
            ? [
              <Button
                  key="0"
                  blue
                  onPress={async () => {
                    await this.generatePatients();
                  }}
                >
                  <Icon type="AntDesign" name="areachart" />
                </Button>,
              <Button
                  key="1"
                  blue
                  onPress={async () => {
                    NavigationService.navigate('SignIn');
                    await RNRestart.Restart();
                  }}
                >
                  <Icon type="AntDesign" name="deleteusergroup" />
                </Button>,
              <Button
                  key="2"
                  blue
                  onPress={async () => {
                    await Realm.deleteFile({
                      schema: [PatientModel, MedicalCaseModel],
                      deleteRealmIfMigrationNeeded: true,
                    });
                    await clearLocalStorage();
                    await persistor.purge();
                    NavigationService.navigate('NewSession');
                    await RNRestart.Restart();
                  }}
                >
                  <Icon type="MaterialCommunityIcons" name="delete-forever" />
                </Button>,
              <Button
                  key="3"
                  blue
                  onPress={async () => {
                    await RNRestart.Restart();
                  }}
                >
                  <Icon type="SimpleLineIcons" name="reload" />
                </Button>,
              <Button
                  key="4"
                  blue
                  onPress={async () => {
                    const session = await getItems('session');
                    const algorithm = await getItem('algorithm');
                    const state$ = store.getState();
                    const sizes = {};

                    Object.keys(state$).map((key) => {
                      sizes[key] = memorySizeOf(state$[key]);
                    });

                    // eslint-disable-next-line no-console
                    console.log({
                      state$,
                      size_state$: memorySizeOf({ ...state$, patient: null }),
                      size_nodes: memorySizeOf(state$.nodes),
                      size_diagnostics: memorySizeOf(state$.diagnostics),
                      size_activities: memorySizeOf(state$.activities),
                      sizes,
                      session,
                      algorithm,
                      size_algorithms: memorySizeOf(algorithm),
                    });
                  }}
                >
                  <Icon type="FontAwesome" name="database" />
                </Button>,
              ]
            : null}
        </Fab>
      </View>
    );
  }
}
