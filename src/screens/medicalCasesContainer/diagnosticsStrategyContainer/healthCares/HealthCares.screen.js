// @flow
import React, { Component } from 'react';
import { Content, Text } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { healthCareType } from '../../../../../frontend_service/constants';
import toReadableFraction from '../../../../utils/toReadableFraction';
import { getDrugs, titleManagementCounseling } from '../../../../../frontend_service/algorithm/questionsStage.algo';
import { calculateCondition } from '../../../../../frontend_service/algorithm/conditionsHelpers.algo';

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

  _renderCapsule = (drug, node, drugDose) => {
    return (
      <>
        <Text customSubTitle>- {node.label}</Text>
        <Text>Mode : {drug.formulationSelected}</Text>
        {drugDose.doseResult === null ? (
          <Text>{drugDose.no_possibility}</Text>
        ) : (
          <>
            <Text>
              Give {drugDose.doseResult * drugDose.dose_form} mg : {drugDose.doseResult} capsule of {drugDose.dose_form}
              mg {drugDose.administration_route_name}
            </Text>
            <Text>
              every {drugDose.recurrence} hours for {drug.duration} days
            </Text>
          </>
        )}
      </>
    );
  };

  _renderBreakable = (drug, node, drugDose) => {
    //  12 hours for 5 days = recurrence for instance in diagnoses .duration
    const unit = drugDose.doseResult / drugDose.breakable;
    const num = Math.floor(unit);

    const rest = drugDose.doseResult % drugDose.breakable;
    let fractionString = ' ';
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
        <Text>Mode : {drug.formulationSelected}</Text>
        {drugDose.doseResult === null ? (
          <Text>{drugDose.no_possibility}</Text>
        ) : (
          <>
            <Text>
              Give {drugDose.doseResult * (drugDose.dose_form / drugDose.breakable)} mg : {num !== Infinity && num !== 0 ? `${num}` : null}
              {fractionString}
              {num !== Infinity && num > 0 && fractionString !== ' ' && ' '}
              tablet of
              {` ${drugDose.dose_form} `}
              mg {drugDose.administration_route_name}
            </Text>
            <Text>
              every {drugDose.recurrence} hours for {drug.duration} days
            </Text>
          </>
        )}
      </>
    );
  };

  _renderDefault = (drug, node, drugDose) => {
    let every = '';

    if (drug.formulationSelected !== null) {
      every = `every ${24 / drugDose.doses_per_day} hours for ${drug.duration} days`;
    }
    return (
      <>
        <Text customSubTitle>- {node.label}</Text>
        <Text>Mode : {drug.formulationSelected === null ? ' No formulation selected !' : drug.formulationSelected}</Text>
        <Text>Duration : {drug.duration}</Text>
        {drug.formulationSelected !== null && <Text>Administration : {drugDose.administration_route_name}</Text>}
        {drug.formulationSelected !== null && <Text>{every}</Text>}
      </>
    );
  };

  _renderLiquid = (drug, node, drugDose) => {
    const ratio = drugDose.liquid_concentration / drugDose.dose_form;
    return (
      <>
        <Text customSubTitle>- {node.label}</Text>
        <Text>Mode : {drug.formulationSelected}</Text>
        <Text>
          Give {ratio * drugDose.doseResult}mg : {drugDose.doseResult}ml of {drugDose.liquid_concentration}mg/{drugDose.dose_form}ml
        </Text>
        <Text>
          every {drugDose.recurrence} hours for {drug.duration} days
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
        {Object.keys(diagnoses.proposed).map((pro) => diagnoses.proposed[pro].agreed && <Text>{diagnoses.proposed[pro].label}</Text>)}
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
        if (calculateCondition(management) === true) {
          return <Text>{node.label}</Text>;
        }
        return null;
      });
    });
  };

  _renderSwitchFormulation = (formulationSelected, drug) => {
    const {
      medicalCase: { nodes },
      app: { t },
    } = this.props;

    const node = nodes[drug.id];
    const drugDose = node.getDrugDoses(drug.formulationSelected);
    switch (drug.formulationSelected) {
      case healthCareType.syrup:
      case healthCareType.suspension:
        return this._renderLiquid(drug, node, drugDose);
      case healthCareType.tablet:
        return this._renderBreakable(drug, node, drugDose);
      case healthCareType.capsule:
        return this._renderCapsule(drug, node, drugDose);
      default:
        return this._renderDefault(drug, node, drugDose);
    }
  };

  _renderDrugDose = () => {
    const drugs = getDrugs();

    return Object.keys(drugs).map((k) => {
      let drug = drugs[k];
      if (drug.agreed) {
        return this._renderSwitchFormulation(drug.formulationSelected, drug);
      }
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
        <Text customTitle>Medicine</Text>
        {this._renderDrugDose()}
        {titleManagementCounseling() && <Text customTitle>Management and Counseling</Text>}
        {this._renderManagement('proposed')}
        {this._renderManagement('additional')}
      </Content>
    );
  }
}
