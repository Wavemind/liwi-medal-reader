// @flow
import React, { Component } from 'react';
import find from 'lodash/find';
import { Content, Text } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';

import { categories, medicationForms } from '../../../../../frontend_service/constants';
import { getDrugs, titleManagementCounseling } from '../../../../../frontend_service/algorithm/questionsStage.algo';
import { calculateCondition } from '../../../../../frontend_service/algorithm/conditionsHelpers.algo';
import Liquid from '../../../../components/Formulations/Liquid';
import Breakable from '../../../../components/Formulations/Breakable';
import Capsule from '../../../../components/Formulations/Capsule';
import Default from '../../../../components/Formulations/Default';
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
    } = this.props;

    const node = nodes[drug.id];
    const drugDose = node.getDrugDoses(drug.formulationSelected);
    switch (drug.formulationSelected) {
      case medicationForms.syrup:
      case medicationForms.suspension:
        return Liquid(drug, node, drugDose);
      case medicationForms.tablet:
        return Breakable(drug, node, drugDose);
      case medicationForms.capsule:
        return Capsule(drug, node, drugDose);
      default:
        return Default(drug, node, drugDose);
    }
  };

  _renderDrugDose = () => {
    const drugs = getDrugs();

    return Object.keys(drugs).map((k) => {
      const drug = drugs[k];
      if (drug.agreed) {
        return this._renderSwitchFormulation(drug.formulationSelected, drug);
      }
    });
  };

  render() {
    const {
      medicalCase,
      app: { t },
    } = this.props;

    return (
      <Content>
        <FinalDiagnosticCards medicalCase={medicalCase} />
      </Content>
    );
  }
}
