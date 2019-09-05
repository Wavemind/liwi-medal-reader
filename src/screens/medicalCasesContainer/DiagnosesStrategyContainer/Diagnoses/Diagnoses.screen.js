import React, { Component } from 'react';
import { Content } from 'native-base';
import FinalDiagnosesList from '../../../../components/FinalDiagnosesList';

export default class Diagnoses extends Component {
  render() {
    return (
      <Content>
        <FinalDiagnosesList />
      </Content>
    );
  }
}
