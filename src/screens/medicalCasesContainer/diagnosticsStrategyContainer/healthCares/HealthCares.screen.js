// @flow
import React, { Component } from 'react';
import { Content } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';

import FinalDiagnosticCards from '../../../../components/FinalDiagnosticCards';

type Props = NavigationScreenProps & {};
type State = {};
// eslint-disable-next-line react/prefer-stateless-function
export default class HealthCares extends Component<Props, State> {
  shouldComponentUpdate(nextProps, nextState) {
    const { pageIndex } = this.props;

    if (pageIndex !== undefined && nextProps.selectedPage !== undefined) {
      return nextProps.selectedPage === pageIndex;
    }
    return true;
  }

  render() {
    const { medicalCase } = this.props;

    return (
      <Content>
        <FinalDiagnosticCards medicalCase={medicalCase} />
      </Content>
    );
  }
}
