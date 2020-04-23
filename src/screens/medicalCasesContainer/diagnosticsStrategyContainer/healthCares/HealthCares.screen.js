// @flow
import React, { Component } from 'react';
import { Content, Text } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { categories, medicationForms } from '../../../../../frontend_service/constants';
import toReadableFraction from '../../../../utils/toReadableFraction';
import { getDrugs, titleManagementCounseling } from '../../../../../frontend_service/algorithm/questionsStage.algo';
import { calculateCondition } from '../../../../../frontend_service/algorithm/conditionsHelpers.algo';
import find from 'lodash/find';

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

  _renderCapsule = (drug, node, drugDose) => {
    const {
      app: { t },
    } = this.props;
    return (
      <>
        <Text customSubTitle>- {node.label}</Text>
        <Text>Mode : {drug.formulationSelected}</Text>
        {drugDose.doseResult === null ? (
          <Text>{drugDose.no_possibility}</Text>
        ) : (
          <>
            <Text>
              {t('drug:give')} {drugDose.doseResult * drugDose.dose_form} {t('drug:mg')} : {drugDose.doseResult} {t('drug:caps')} {drugDose.dose_form}
              {t('drug:mg')} {drugDose.administration_route_name}
            </Text>
            <Text>
              {t('drug:every')} {drugDose.recurrence} {t('drug:h')} {drug.duration} {t('drug:days')}
            </Text>
          </>
        )}
      </>
    );
  };

  _renderBreakable = (drug, node, drugDose) => {
    const {
      app: { t },
    } = this.props;
    //  12 hours for 5 days = recurrence for instance in diagnoses .duration
    const unit = drugDose.doseResult / drugDose.breakable;
    const num = Math.floor(unit);

    const rest = drugDose.doseResult % drugDose.breakable;
    let fractionString = ' ';
    if (rest !== 0) {
      const r = toReadableFraction(rest / drugDose.breakable);
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
        <Text>
          {t('drug:mode')} : {drug.formulationSelected}
        </Text>
        {drugDose.doseResult === null ? (
          <Text>{drugDose.no_possibility}</Text>
        ) : (
          <>
            <Text>
              {t('drug:give')} {drugDose.doseResult * (drugDose.dose_form / drugDose.breakable)} {t('drug:mg')} : {num !== Infinity && num !== 0 ? `${num}` : null}
              {fractionString}
              {num !== Infinity && num > 0 && fractionString !== ' ' && ' '}
              {t('drug:tablet')}
              {` ${drugDose.dose_form} `}
              {t('drug:mg')} {drugDose.administration_route_name}
            </Text>
            <Text>
              {t('drug:every')}
              {drugDose.recurrence} {t('drug:h')}
              {drug.duration} {t('drug:days')}
            </Text>
          </>
        )}
      </>
    );
  };

  _renderDefault = (drug, node, drugDose) => {
    const {
      app: { t },
    } = this.props;
    let every = '';

    if (drug.formulationSelected !== null) {
      every = `every ${24 / drugDose.doses_per_day} hours for ${drug.duration} days`;
    }
    return (
      <>
        <Text customSubTitle>- {node.label}</Text>
        <Text>
          {t('drug:mode')} : {drug.formulationSelected === null ? ' No formulation selected !' : drug.formulationSelected}
        </Text>
        <Text>
          {t('drug:d')} : {drug.duration}
        </Text>
        {drug.formulationSelected !== null && (
          <Text>
            {t('drug:admin')} : {drugDose.administration_route_name}
          </Text>
        )}
        {drug.formulationSelected !== null && <Text>{every}</Text>}
      </>
    );
  };

  _renderLiquid = (drug, node, drugDose) => {
    const {
      app: { t },
    } = this.props;
    const ratio = drugDose.liquid_concentration / drugDose.dose_form;
    return (
      <>
        <Text customSubTitle>- {node.label}</Text>
        <Text>
          {t('drug:mode')} : {drug.formulationSelected}
        </Text>
        <Text>
          {t('drug:give')} {ratio * drugDose.doseResult}
          {t('drug:mg')} : {drugDose.doseResult}
          {t('drug:mf')} {t('drug:of')} {drugDose.liquid_concentration}
          {t('drug:mg')}/{drugDose.dose_form}
          {t('drug:ml')}
        </Text>
        <Text>
          {t('drug:every')} {drugDose.recurrence} {t('drug:h')} {drug.duration} {t('drug:days')}
        </Text>
      </>
    );
  };

  _renderDiagnoses = () => {
    const {
      medicalCase: { diagnoses },
      app: { t },
    } = this.props;

    return (
      <>
        <Text customTitle>{t('diagnoses:list')} </Text>
        {Object.keys(diagnoses.proposed).map((pro) => diagnoses.proposed[pro].agreed && <Text key={`${pro}prop`}>{diagnoses.proposed[pro].label}</Text>)}
        {Object.keys(diagnoses.additional).map((pro) => (
          <Text key={`${pro}add`}>{diagnoses.additional[pro].label}</Text>
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
          return <Text key={`${id}manag`}>{node.label}</Text>;
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
      case medicationForms.syrup:
      case medicationForms.suspension:
        return this._renderLiquid(drug, node, drugDose);
      case medicationForms.tablet:
        return this._renderBreakable(drug, node, drugDose);
      case medicationForms.capsule:
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
      app: { t },
    } = this.props;

    const weight = find(nodes, { reference: 1, category: categories.basicMeasurement });

    return (
      <Content>
        <Text customTitle> {t('diagnoses:sum')}</Text>
        <Text>
          {t('diagnoses:weight')} : {weight.value}kg
        </Text>
        {this._renderDiagnoses()}
        <Text customTitle>{t('diagnoses:medicine')}</Text>
        {this._renderDrugDose()}
        {titleManagementCounseling() && <Text customTitle>{t('diagnoses:man')}</Text>}
        {this._renderManagement('proposed')}
        {this._renderManagement('additional')}
      </Content>
    );
  }
}
