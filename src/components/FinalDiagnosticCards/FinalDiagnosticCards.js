// @flow

import * as React from 'react';
import { Text, Card, CardItem, Body, View, Icon } from 'native-base';

import { TouchableOpacity } from 'react-native';
import { styles } from './FinalDiagnosticCards.style';
import { LiwiTitle2 } from '../../template/layout';
import { medicationForms, modalType } from '../../../frontend_service/constants';

import Liquid from '../Formulations/Liquid';
import Breakable from '../Formulations/Breakable';
import Capsule from '../Formulations/Capsule';
import Default from '../Formulations/Default';
import { calculateCondition } from '../../../frontend_service/algorithm/conditionsHelpers.algo';
import { drugAgreed, drugDoses } from '../../../frontend_service/helpers/Drug.model';
import { finalDiagnosticCalculateCondition } from '../../../frontend_service/helpers/FinalDiagnostic.model';

export default class FinalDiagnosticCards extends React.Component {
  /**
   * Display drug formulation based on medication form selected
   * @param {Object} drug - Drug in final diagnostic model
   * @returns {*}
   * @private
   */
  _renderSwitchFormulation = (drug) => {
    const {
      app: { t, algorithm },
    } = this.props;
    const node = algorithm.nodes[drug.id];
    const drugDose = drugDoses(drug.formulationSelected, algorithm, drug.id);

    if (node.formulations[drug.formulationSelected] !== undefined) {
      switch (node.formulations[drug.formulationSelected].medication_form) {
        case medicationForms.syrup:
        case medicationForms.suspension:
        case medicationForms.powder_for_injection:
        case medicationForms.solution:
          return Liquid(drug, node, drugDose);
        case medicationForms.tablet:
          return Breakable(drug, node, drugDose);
        case medicationForms.capsule:
          return Capsule(drug, node, drugDose);
        default:
          return Default(drug, node, drugDose);
      }
    } else {
      return <Text italic>{t('drug:missing_medicine_formulation')}</Text>;
    }
  };

  /**
   * Open redux modal
   */
  openModal = (node) => {
    const { updateModalFromRedux } = this.props;
    updateModalFromRedux({ node }, modalType.description);
  };

  /**
   * Display final diagnostic cards with medicine and management choose
   * @param {Object} diagnoseFinalDiagnostics - Diagnoses entry in medical case
   * @param {String} title - Diagnoses key
   * @returns {Array<unknown>}
   * @private
   */
  _renderFinalDiagnosticCards = (diagnoseFinalDiagnostics, title) => {
    const {
      app: { t, algorithm },
      medicalCase,
    } = this.props;

    const drugsAvailable = drugAgreed(medicalCase.diagnoses, algorithm);

    return Object.keys(diagnoseFinalDiagnostics).map((key) => {
      if ((diagnoseFinalDiagnostics[key].agreed && finalDiagnosticCalculateCondition(algorithm, medicalCase, medicalCase.nodes[key])) || title === 'additional' || title === 'custom') {
        return (
          <Card key={key}>
            <CardItem style={styles.cardItemCondensed}>
              <Body style={styles.cardTitleContent}>
                <LiwiTitle2 noBorder style={styles.flex}>
                  {diagnoseFinalDiagnostics[key].label}
                  {'\n'}
                  <Text note>{t(`diagnoses_label:${title}`)}</Text>
                </LiwiTitle2>
                <View style={styles.tooltipButtonFinalDiagnostic}>
                  <View flex>
                    <TouchableOpacity style={styles.touchable} transparent onPress={() => this.openModal(diagnoseFinalDiagnostics[key])}>
                      <Icon type="AntDesign" name="info" style={styles.iconInfo} />
                    </TouchableOpacity>
                  </View>
                </View>
              </Body>
            </CardItem>
            <CardItem style={styles.cardItemCondensed}>
              <Body>
                <LiwiTitle2 noBorder style={styles.cardTitle}>
                  {t('diagnoses:medicines')}
                </LiwiTitle2>

                {diagnoseFinalDiagnostics[key].drugs !== undefined && Object.keys(diagnoseFinalDiagnostics[key].drugs).length > 0 ? (
                  title === 'custom' ? (
                    diagnoseFinalDiagnostics[key].drugs.map((drug) => (
                      <View style={styles.drugContainer} key={drug}>
                        <View style={styles.formulationContainer}><Text>{drug}</Text></View>
                      </View>
                    ))
                  ) : (
                    Object.keys(diagnoseFinalDiagnostics[key].drugs).map((drugKey) => {
                      if (drugsAvailable[drugKey] !== undefined) {
                        return (
                          <View style={styles.drugContainer} key={drugKey}>
                            <View style={styles.formulationContainer}>{this._renderSwitchFormulation(drugsAvailable[drugKey])}</View>
                            <View style={styles.tooltipButton}>
                              <View flex>
                                <TouchableOpacity style={styles.touchable} transparent onPress={() => this.openModal(drugsAvailable[drugKey])}>
                                  <Icon type="AntDesign" name="info" style={styles.iconInfo} />
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        );
                      }
                    })
                  )
                ) : (
                  <Text italic>{t('diagnoses:no_medicines')}</Text>
                )}
              </Body>
            </CardItem>
            <CardItem style={styles.cardItemCondensed}>
              <Body>
                <LiwiTitle2 noBorder style={styles.cardTitle}>
                  {t('diagnoses:management')}
                </LiwiTitle2>
                {diagnoseFinalDiagnostics[key].managements !== undefined && Object.keys(diagnoseFinalDiagnostics[key].managements).length > 0 ? (
                  Object.keys(diagnoseFinalDiagnostics[key].managements).map((managementKey) => {
                    const management = diagnoseFinalDiagnostics[key].managements[managementKey];
                    const node = algorithm.nodes[management.id];
                    if (calculateCondition(algorithm, management) === true && management.agreed === true) {
                      return (
                        <View style={styles.drugContainer} key={`${managementKey}_management`}>
                          <View style={styles.formulationContainer}>
                            <Text>{node.label}</Text>
                          </View>
                          <View style={styles.tooltipButton}>
                            <View flex>
                              <TouchableOpacity style={styles.touchable} transparent onPress={() => this.openModal(node)}>
                                <Icon type="AntDesign" name="info" style={styles.iconInfo} />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      );
                    }
                    return null;
                  })
                ) : (
                  <Text italic>{t('diagnoses:no_managements')}</Text>
                )}
              </Body>
            </CardItem>
          </Card>
        );
      }
      return null;
    });
  };

  render() {
    const { medicalCase } = this.props;

    // Need this shit when closing a medical otherwise it crash
    if (medicalCase.id === undefined) {
      return null;
    }

    return Object.keys(medicalCase.diagnoses).map((key) => this._renderFinalDiagnosticCards(medicalCase.diagnoses[key], key));
  }
}
