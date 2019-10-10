// @flow

import React from 'react';
import { NavigationEvents } from 'react-navigation';

/**
 *
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
export const WrapperNavigation = (Component: React.ComponentType<any>) =>
  class extends Component<any> {
    shouldComponentUpdate(nextProps, nextState) {
      return nextState.navigationStatus === 'didFocus';
    }

    state = {
      navigationStatus: null,
    };

    render() {
      const { navigationStatus } = this.state;
      return (
        <React.Fragment>
          <NavigationEvents
            onDidFocus={(payload) => {
              this.setState({ navigationStatus: payload.type });
            }}
            onWillBlur={(payload) => {
              this.setState({ navigationStatus: payload.type });
            }}
          />
          <Component {...this.props} focus={navigationStatus} />
        </React.Fragment>
      );
    }
  };
