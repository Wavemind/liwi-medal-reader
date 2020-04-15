import React, { Component } from 'react';
import { Button, Fab, Icon, View } from 'native-base';
import RNRestart from 'react-native-restart';
import FilesystemStorage from 'redux-persist-filesystem-storage';
import { clearLocalStorage, clearPatients, getItems, setItem } from '../engine/api/LocalStorage';
import NavigationService from '../engine/navigation/Navigation.service';
import { persistor, store } from '../../frontend_service/store';
import { memorySizeOf } from './swissKnives';

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
        <Fab active={active} direction="up" containerStyle={{}} style={{ backgroundColor: '#ffb21d' }} position="bottomRight" onPress={() => this.setState({ active: !active })}>
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
                    const sessions = await getItems('sessions');
                    const algorithms = await getItems('algorithms');
                    const patients = await getItems('patients');
                    const state$ = store.getState();
                    let k = await FilesystemStorage.getItem('persist:medicalCase');
                    k = await JSON.parse(k);
                    // eslint-disable-next-line no-console
                    console.log({
                      persist: k,
                      state$,
                      size_state$: memorySizeOf(state$),
                      sessions,
                      size_sessions: memorySizeOf(sessions),
                      algorithms,
                      size_algorithms: memorySizeOf(algorithms),
                      patients,
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
                    const algo = require('../../frontend_service/api/algo_refractor_from_olga_14_10_19');
                    const session = require('../../frontend_service/api/session');

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
