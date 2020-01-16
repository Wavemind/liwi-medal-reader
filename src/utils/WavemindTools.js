import React, { Component } from 'react';
import { Button, Fab, Icon, View } from 'native-base';
import RNRestart from 'react-native-restart';
import { clearLocalStorage, clearPatients, getItems, setItem } from '../engine/api/LocalStorage';
import NavigationService from '../engine/navigation/Navigation.service';
import { persistor, store } from '../../frontend_service/store';
import { memorySizeOf } from './swissKnives';
import FilesystemStorage from 'redux-persist-filesystem-storage';

export default class WavemindTools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
  }

  render() {
    const { active } = this.state;

    return (
      <View>
        <Fab
          active={active}
          direction="up"
          containerStyle={{}}
          style={{ backgroundColor: '#ffb21d' }}
          position="bottomRight"
          onPress={() => this.setState({ active: !active })}
        >
          <Icon name="developer-mode" type="MaterialIcons" />
          {active
            ? [
                <Button
                  key="1"
                  blue
                  onPress={async () => {
                    await clearPatients();
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
                    await clearLocalStorage();
                    await persistor.purge();
                    NavigationService.navigate('SignIn');
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
                    let sessions = await getItems('sessions');
                    let algorithms = await getItems('algorithms');
                    let patients = await getItems('patients');
                    let state$ = store.getState();
                    let k = await FilesystemStorage.getItem('persist:medicalCase');
                    k = await JSON.parse(k);
                    // eslint-disable-next-line no-console
                    console.log({
                      persist: k,
                      state$: state$,
                      size_state$: memorySizeOf(state$),
                      sessions: sessions,
                      size_sessions: memorySizeOf(sessions),
                      algorithms: algorithms,
                      size_algorithms: memorySizeOf(algorithms),
                      patients: patients,
                      size_patients: memorySizeOf(patients),
                    });
                  }}
                >
                  <Icon type="FontAwesome" name="database" />
                </Button>,
                <Button
                  key="5"
                  blue
                  onPress={async () => {
                    let algo = require('../../frontend_service/api/algo_refractor_from_olga_14_10_19');
                    let session = require('../../frontend_service/api/session');

                    await setItem('sessions', [session]);
                    await setItem('algorithms', [algo]);
                    await RNRestart.Restart();
                  }}
                >
                  <Icon type="MaterialCommunityIcons" name="lan-disconnect" />
                </Button>,
              ]
            : null}
        </Fab>
      </View>
    );
  }
}
