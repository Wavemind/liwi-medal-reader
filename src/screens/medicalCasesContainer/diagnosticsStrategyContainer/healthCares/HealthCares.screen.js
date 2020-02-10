// @flow
import React, { Component } from 'react';
import { Content, Text, View } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { styles } from './HealthCares.style';
import ToolTipModal from '../../../../components/ToolTipModal';
import { healthCareType } from '../../../../../frontend_service/constants';
import { SeparatorLine } from '../../../../template/layout';

type Props = NavigationScreenProps & {};
type State = {};
// eslint-disable-next-line react/prefer-stateless-function
export default class HealthCares extends Component<Props, State> {
  _renderHealthCareType = (healthCare) => {
    const { drugDoses } = healthCare;
    switch (healthCare.treatmentType) {
      case healthCareType.liquid:
        break;
      case healthCareType.pill:
        if (drugDoses !== null) {
          return (
            <View>
              <Text>{healthCare.label}</Text>
              <Text>{healthCare.description}</Text>
              <SeparatorLine />
              <Text>Reference : {healthCare.reference}</Text>
              <Text>Id : {healthCare.id}</Text>
              <SeparatorLine />
              <Text>Pill Size : {healthCare.pillSize}</Text>
              <Text>Maximum dose : {healthCare.maximalDose}</Text>
              <Text>Min dose (mg/Kg) : {drugDoses.minDoseMg}</Text>
              <Text>Max dose (mg/kg) : {drugDoses.maxDoseMg}</Text>
              <Text>Min dose (cap) : {drugDoses.minDoseCap}</Text>
              <Text>Max dose (cap) : {drugDoses.maxDoseCap}</Text>
              <Text>Dose result : {drugDoses.doseResult}</Text>
            </View>
          );
        }

        break;
    }
  };
  _renderHealthCare = (healthCare) => {
    return Object.keys(healthCare).map((index) => (
      <View style={styles.blocManagement} key={index}>
        <Text style={styles.spaceText} size-auto key={'healthcare' + healthCare[index].reference}>
          {__DEV__ ? `${healthCare[index].reference} - ` : null}
          {healthCare[index].label}
        </Text>
        {healthCare[index].description !== null ? <Text style={styles.desc}>{healthCare[index].description}</Text> : null}
        <ToolTipModal>{this._renderHealthCareType(healthCare[index])}</ToolTipModal>
      </View>
    ));
  };

  render() {
    const {
      medicalCase,
      app: { t },
    } = this.props;

    const healthCares = medicalCase.nodes.getHealthCares();

    const { managements, treatments } = healthCares;

    return (
      <Content>
        <Text customTitle>{t('medical_case:managements')}</Text>
        {this._renderHealthCare(managements)}
        <Text customTitle>{t('medical_case:treatments')}</Text>
        {this._renderHealthCare(treatments)}
      </Content>
    );
  }
}
