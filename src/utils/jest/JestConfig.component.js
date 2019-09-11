// @flow
/* eslint-disable*/

/** @format */
import * as React from 'react';

import 'core-js/fn/reflect/define-metadata';
import 'core-js/fn/reflect/delete-metadata';
import 'core-js/fn/reflect/get-metadata';
import 'core-js/fn/reflect/get-metadata-keys';
import 'core-js/fn/reflect/get-own-metadata';
import 'core-js/fn/reflect/get-own-metadata-keys';
import 'core-js/fn/reflect/has-metadata';
import 'core-js/fn/reflect/has-own-metadata';
import 'core-js/fn/reflect/metadata';
import 'es6-symbol/implement';
import type { StateApplicationContext } from '../../engine/contexts/Application.context';
import { ApplicationProvider, withApplication } from '../../engine/contexts/Application.context';
import { SessionsProvider, withSessions } from '../../engine/contexts/Sessions.context';
import 'jest-styled-components';
import { NavigationScreenProps } from 'react-navigation';

type Props = NavigationScreenProps & {};

type State = StateApplicationContext & {};

console.disableYellowBox = true;

export class JestWithContext extends React.Component<Props, State> {
  componentWillMount() {
  }

  render() {
    let ChilComponent = withSessions(withApplication(this.props.child));

    let customprops = {
      ...this.props.customProps,
    };

    return (
      <ApplicationProvider>
        <SessionsProvider>
          <ChilComponent {...customprops} />
        </SessionsProvider>
      </ApplicationProvider>
    );
  }
}
