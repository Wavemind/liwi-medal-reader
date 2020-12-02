// @flow
import React, { Component } from 'react';
import { Content, Text } from 'native-base';

import FinalDiagnosticCards from '../../../../components/FinalDiagnosticCards';

export default class HealthCares extends Component {
  shouldComponentUpdate() {
    const { selectedPage } = this.props;
    return selectedPage === 4;
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
