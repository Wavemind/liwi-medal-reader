// @flow

import React from 'react';
import { NavigationEvents } from 'react-navigation';
import { View } from 'native-base';
import Drawer from '../engine/navigation/drawer';
import { screenWidth } from './constants';

/**
 * @param Component
 * @return Wrapped Component
 * @state
 *  navigationStatus: String
 *    Can be depending the callback in NavigationEvents :
 *      null = initial render
 *      willFocus : will focus
 *      didFocus : focus finish
 *      willBlur : will show again
 *      didBlur: show again finish
 *
 *      This component update only on this.setState
 *      So we update the render only on WillFocus OR WillBlur
 *      This component can control the good render only when the screen is focus
 *
 *      More info at https://reactnavigation.org/docs/en/navigation-events.html
 *
 */
export const WrapperNavigation = (Component: React.ComponentType<any>, props = { navigationStatus: 'didFocus' }) =>
  class extends Component<any> {
    shouldComponentUpdate(nextProps, nextState) {
      if (props.navigationStatus === 'willBlur') {
        return nextState.navigationStatus === 'didFocus' || nextState.navigationStatus === 'willBlur';
      }

      return nextState.navigationStatus === 'didFocus' || nextState.navigationStatus === 'willFocus';
    }

    state = {
      navigationStatus: null,
    };

    render() {
      const { navigationStatus } = this.state;
      const { navigation } = this.props;
      const drawerWidth = screenWidth / 2.2;

      const showMiniDrawer = navigation?.getParam('showMiniDrawer');

      return (
        <React.Fragment>
          <NavigationEvents
            onDidFocus={() => {
              this.setState({ navigationStatus: 'didFocus' });
            }}
            onWillBlur={() => {
              this.setState({ navigationStatus: 'willBlur' });
            }}
            onWillFocus={() => {
              this.setState({ navigationStatus: 'willFocus' });
            }}
          />
          <View style={{ flex: 1, flexDirection: 'row' }}>
            {showMiniDrawer && (
              <View>
                <Drawer {...this.props} drawerWidth={drawerWidth} isDrawer={false} />
              </View>
            )}

            <View style={{ flex: 1 }}>
              <Component {...this.props} focus={navigationStatus} />
            </View>
          </View>
        </React.Fragment>
      );
    }
  };
