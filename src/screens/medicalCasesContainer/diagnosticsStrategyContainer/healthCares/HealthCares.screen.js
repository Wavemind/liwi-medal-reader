// @flow
import React, { Component } from 'react';
import { View } from 'native-base';

import FinalDiagnosticCards from '../../../../components/FinalDiagnosticCards';

export default class HealthCares extends Component {
  shouldComponentUpdate() {
    const {
      selectedPage,
      app: { algorithm },
    } = this.props;

    return selectedPage === algorithm.config.track_referral ? 5 : 4;
  }

  render() {
    const { medicalCase } = this.props;

    return (
      <FinalDiagnosticCards medicalCase={medicalCase} />
    );
  }
}
