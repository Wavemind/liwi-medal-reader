// @flow
import React, { Component } from 'react';
import { Content, Text, View } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { styles } from './HealthCares.style';
import ToolTipModal from '../../../../components/ToolTipModal';
import { healthCareType } from '../../../../../frontend_service/constants';
import { SeparatorLine } from '../../../../template/layout';
import toReadableFraction from '../../../../utils/toReadableFraction';

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

  /**
   *  Render content of modal healthCare
   *
   *  @params object : healthCare
   */
  _renderHealthCareType = (healthCare) => {
    const {
      app: { t },
    } = this.props;

    const { drugDoses } = healthCare;
    switch (healthCare.treatmentType) {
      case healthCareType.liquid:
        return null;
      case healthCareType.pill:
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
            {drugDoses !== null ? (
              <>
                <Text>Min dose (mg/Kg) : {drugDoses.minDoseMg}</Text>
                <Text>Max dose (mg/kg) : {drugDoses.maxDoseMg}</Text>
                <Text>Min dose (cap) : {drugDoses.minDoseCap}</Text>
                <Text>Max dose (cap) : {drugDoses.maxDoseCap}</Text>
                <Text>Dose result : {drugDoses.doseResult}</Text>
              </>
            ) : (
              <Text error>{t('medical_case:healthcares_no_weight')}</Text>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  /**
   *  Render a healthcare by type
   *
   *  @params object : healthCare
   */
  _renderHealthCare = (healthCare) =>
    Object.keys(healthCare).map((index) => (
      <View style={styles.blocManagement} key={index}>
        <Text style={styles.spaceText} size-auto key={`healthcare${healthCare[index].reference}`}>
          {__DEV__ && `${healthCare[index].reference} - `}
          {healthCare[index].label}
        </Text>
        {healthCare[index].description !== null ? <Text style={styles.desc}>{healthCare[index].description}</Text> : null}
        <ToolTipModal toolTipIcon>{this._renderHealthCareType(healthCare[index])}</ToolTipModal>
      </View>
    ));

  _renderCustom = () => {
    const {
      medicalCase: { diagnoses },
    } = this.props;

    return diagnoses.custom.map((c) => {
      return (
        <>
          <Text customSubTitle>- {c.label}</Text>
          {c.drugs.map((d) => (
            <Text>{d}</Text>
          ))}
        </>
      );
    });
  };
  _renderBreakable = (drug, node, drugDose) => {
    //  12 hours for 5 days = recurrence for instance in diagnoses .duration
    const unit = drugDose.doseResult / drugDose.breakable;
    const num = Math.floor(unit);

    const rest = drugDose.doseResult % drugDose.breakable;
    let fractionString = '';
    if (rest !== 0) {
      let r = toReadableFraction(rest / drugDose.breakable);
      if (r.numerator === 1 && r.denominator === 2) {
        fractionString = '½ ';
      } else if (r.numerator === 1 && r.denominator === 4) {
        fractionString = '¼ ';
      } else if (r.numerator === 3 && r.denominator === 4) {
        fractionString = '¾ ';
      } else {
        // other fraction
        fractionString = `${r.numerator} / ${r.denominator}`;
      }
    }

    return (
      <>
        <Text customSubTitle>- {node.label}</Text>
        <Text>Mode {drug.formulationSelected}</Text>
        {drugDose.doseResult === null ? (
          <Text>{drugDose.no_possibility}</Text>
        ) : (
          <>
            <Text>Give {drugDose.doseResult * (drugDose.dose_form / drugDose.breakable)} mg</Text>
            <Text>
              Prescription : {num !== Infinity && num !== 0 ? num : null}
              {num !== Infinity && num > 0 && fractionString !== '' && ' and '}
              {fractionString}
              {drugDose.dose_form}
              mg tablet {drugDose.administration_route_name}
            </Text>
          </>
        )}
      </>
    );
  };

  _renderDefault = (drug, node, drugDose) => {
    return (
      <>
        <Text customSubTitle>- {node.label}</Text>
        <Text>Mode {drug.formulationSelected}</Text>
        <Text>Duration :{drug.duration}</Text>
        <Text>Administration :{drugDose.administration_route_name}</Text>
      </>
    );
  };

  _renderLiquid = (drug, node, drugDose) => {
    const ratio = drugDose.liquid_concentration / drugDose.dose_form;
    return (
      <>
        <Text customSubTitle>- {node.label}</Text>
        <Text>Mode {drug.formulationSelected}</Text>
        <Text>
          Give {ratio * drugDose.doseResult}mg : {drugDose.doseResult}ml of {drugDose.liquid_concentration}mg/{drugDose.dose_form}ml
        </Text>
        <Text>
          every : {drugDose.recurrence} hours for {drug.duration} days
        </Text>
      </>
    );
  };

  _renderDiagnoses = () => {
    const {
      medicalCase: { diagnoses, nodes },
      app: { t },
    } = this.props;

    return (
      <>
        <Text customTitle>List of diagnoses </Text>
        {Object.keys(diagnoses.proposed).map((pro) => (
          <Text>{diagnoses.proposed[pro].label}</Text>
        ))}
        {Object.keys(diagnoses.additional).map((pro) => (
          <Text>{diagnoses.additional[pro].label}</Text>
        ))}
      </>
    );
  };

  _renderManagement = (key) => {
    const {
      medicalCase: { diagnoses, nodes },
      app: { t },
    } = this.props;

    return Object.keys(diagnoses[key]).map((diagnoseId) => {
      return Object.keys(diagnoses[key][diagnoseId].managements).map((id) => {
        const management = diagnoses[key][diagnoseId].managements[id];
        const node = nodes[management.id];

        return <Text>{node.label}</Text>;
      });
    });
  };

  _renderDrugDose = (type) => {
    const {
      medicalCase: { diagnoses, nodes },
      app: { t },
    } = this.props;

    return Object.keys(diagnoses[type]).map((diagnoseId) => {
      return Object.keys(diagnoses[type][diagnoseId].drugs).map((drugId) => {
        const drug = diagnoses[type][diagnoseId].drugs[drugId];
        const node = nodes[drug.id];
        const drugDose = node.getDrugDoses(drug.formulationSelected);

        switch (drug.formulationSelected) {
          case healthCareType.syrup:
          case healthCareType.suspension:
            return this._renderLiquid(drug, node, drugDose);
          case healthCareType.tablet:
            return this._renderBreakable(drug, node, drugDose);
          default:
            return this._renderDefault(drug, node, drugDose);
        }
      });
    });
  };

  render() {
    const {
      medicalCase: { nodes },
    } = this.props;

    return (
      <Content>
        <Text customTitle>Summary Treatment</Text>
        <Text>Weight : {nodes['3'].value}kg</Text>
        {this._renderDiagnoses()}
        <Text customTitle>Medecine</Text>
        {this._renderDrugDose('proposed')}
        {this._renderDrugDose('additional')}
        <Text customTitle>Manually added drug </Text>
        {this._renderCustom()}
        <Text customTitle>Management and Counseling</Text>
        {this._renderManagement('proposed')}
        {this._renderManagement('additional')}
      </Content>
    );
  }
}
