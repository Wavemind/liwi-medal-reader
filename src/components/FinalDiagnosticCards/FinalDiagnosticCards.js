// @flow

import * as React from 'react';
import { View, Text, Card, CardItem, Body } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';

import { styles } from './FinalDiagnosticCards.style';
import { LiwiTitle2, LiwiTitle4 } from '../../template/layout';
import { getDrugs } from '../../../frontend_service/algorithm/questionsStage.algo';
import { medicationForms } from '../../../frontend_service/constants';

import Liquid from '../Formulations/Liquid';
import Breakable from '../Formulations/Breakable';
import Capsule from '../Formulations/Capsule';
import Default from '../Formulations/Default';
import { calculateCondition } from '../../../frontend_service/algorithm/conditionsHelpers.algo';

type Props = NavigationScreenProps & {};
type State = {};

export default class FinalDiagnosticCards extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    const { medicalCase } = props;
    const { nodes } = medicalCase;

    const drugsAvailable = getDrugs(medicalCase.diagnoses);

    this.state = {
      medicalCase,
      nodes,
      drugsAvailable,
    };
  }

  /**
   * Display drug formulation based on medication form selected
   * @param {Object} drug - Drug in final diagnostic model
   * @returns {*}
   * @private
   */
  _renderSwitchFormulation = (drug) => {
    const { nodes } = this.state;

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

  /**
   * Display final diagnostic cards with medicine and management choose
   * @param {Object} finalDiagnosticCategory - Diagnoses entry in medical case
   * @param {String} title - Diagnoses key
   * @returns {Array<unknown>}
   * @private
   */
  _renderFinalDiagnosticCards = (finalDiagnosticCategory, title) => {
    const {
      app: { t },
    } = this.props;
    const { drugsAvailable, nodes } = this.state;

    return Object.keys(finalDiagnosticCategory).map((key) => {
      if (finalDiagnosticCategory[key].agreed || title === 'additional') {
        return (
          <Card key={key}>
            <CardItem>
              <Body style={styles.body}>
                <View style={styles.flex}>
                  <LiwiTitle2 noBorder>{finalDiagnosticCategory[key].label}</LiwiTitle2>
                </View>
                <View style={styles.alignRight}>
                  <LiwiTitle2 noBorder>
                    <Text note>{t(`diagnoses_label:${title}`)}</Text>
                  </LiwiTitle2>
                </View>
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <LiwiTitle4>{t('diagnoses:medicines')}</LiwiTitle4>
                {Object.keys(finalDiagnosticCategory[key].drugs).map((drugKey) => {
                  if (drugsAvailable[drugKey] !== undefined) {
                    return this._renderSwitchFormulation(drugsAvailable[drugKey]);
                  }
                })}
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <LiwiTitle4>{t('diagnoses:man')}</LiwiTitle4>
                {Object.keys(finalDiagnosticCategory[key].managements).map((managementKey) => {
                  const management = finalDiagnosticCategory[key].managements[managementKey];
                  const node = nodes[management.id];
                  if (calculateCondition(management) === true) {
                    return (
                      <Text size-auto key={`${managementKey}-management`}>
                        {node.label}
                      </Text>
                    );
                  }
                  return null;
                })}
              </Body>
            </CardItem>
          </Card>
        );
      }
      return null;
    });
  };

  render() {
    const { medicalCase } = this.state;
console.log('props', this.props)
console.log('state', this.state)
    return Object.keys(medicalCase.diagnoses).map((key) => this._renderFinalDiagnosticCards(medicalCase.diagnoses[key], key));
  }
}
