import React, { Component } from 'react';
import { Button, Fab, Icon, View } from 'native-base';
import RNRestart from 'react-native-restart';
import {
  clearLocalStorage,
  clearPatients,
  getItems,
  setItem,
} from '../engine/api/LocalStorage';
import NavigationService from '../engine/navigation/Navigation.service';
import { store } from '../../frontend_service/store';

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
                key="delete-button"
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
                key="delete-button"
                blue
                onPress={async () => {
                    await clearLocalStorage();
                    NavigationService.navigate('SignIn');
                    await RNRestart.Restart();
                  }}
              >
                <Icon type="MaterialCommunityIcons" name="delete-forever" />
              </Button>,
              <Button
                key="reload-button"
                blue
                onPress={async () => {
                    await RNRestart.Restart();
                  }}
              >
                <Icon type="SimpleLineIcons" name="reload" />
              </Button>,
              <Button
                key="reload-button"
                blue
                onPress={async () => {
                    let sessions = await getItems('sessions');
                    let algorithms = await getItems('algorithms');
                    let state$ = store.getState();

                    // eslint-disable-next-line no-console
                    console.log({
                      state$: state$,
                      sessions: sessions,
                      algorithms: algorithms,
                    });
                  }}
              >
                <Icon type="FontAwesome" name="database" />
              </Button>,
              <Button
                key="reload-button"
                blue
                onPress={async () => {
                    let algo = require('../../frontend_service/api/last_algo_19_09_19');
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
