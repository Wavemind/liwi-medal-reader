// @flow

import React, { Component } from 'react';
import { View } from 'native-base';

type Props = {
  /**
   * Description of prop "foo" (a sample number).
   */
  foo: number,
  bar?: string,
};

type State = {
  wow: number,
};

/**
 *
 * General component description.
 * E.g.:
 * ```html
 * <ExempleFlow foo={541} />
 * ```
 *
 *
 *  __MarkDown__
 *
 */
export default class ExempleFlow extends Component<Props, State> {
  state = { wow: 1 };

  func(x: number): number {
    return x * 2;
  }

  render() {
    return <View />;
  }
}
