// @flow

import * as React from 'react';
import { Text, Card, CardItem, Body, View, Icon } from 'native-base';
import _ from 'lodash';

import { TouchableOpacity, ScrollView } from 'react-native';
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
import { translateText } from '../../utils/i18n';

export default class FinalDiagnosticCards extends React.Component {
  /**
   * Display drug formulation based on medication form selected
   * @param {Object} drug - Drug in final diagnostic model
   * @returns {*}
   * @private
   */
  _renderSwitchFormulation = (drug) => {
    const {
      app: { t, algorithm, algorithmLanguage },
    } = this.props;
    const node = algorithm.nodes[drug.id];
    const drugDose = drugDoses(drug.formulationSelected, algorithm, drug.id);

    if (node.formulations[drug.formulationSelected] !== undefined) {
      switch (node.formulations[drug.formulationSelected].medication_form) {
        case medicationForms.syrup:
        case medicationForms.suspension:
        case medicationForms.powder_for_injection:
        case medicationForms.solution:
          return Liquid(drug, node, drugDose, algorithmLanguage);
        case medicationForms.tablet:
          return Breakable(drug, node, drugDose, algorithmLanguage);
        case medicationForms.capsule:
          return Capsule(drug, node, drugDose, algorithmLanguage);
        default:
          return Default(drug, node, drugDose, algorithmLanguage);
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
      app: { t, algorithm, algorithmLanguage },
      medicalCase,
    } = this.props;

    const drugsAvailable = drugAgreed(medicalCase.diagnoses, algorithm);
    let finalDiagnostics = [];

    // Skip ordering for custom final diagnostics
    if (title !== 'custom') {
      // Order by priority
      finalDiagnostics = _.orderBy(Object.values(diagnoseFinalDiagnostics), (finalDiagnostic) => algorithm.nodes[finalDiagnostic.id].level_of_urgency, ['desc', 'asc']);
    } else {
      finalDiagnostics = Object.values(diagnoseFinalDiagnostics);
    }

    return finalDiagnostics.map((finalDiagnostic) => {
      if ((finalDiagnostic.agreed && finalDiagnosticCalculateCondition(algorithm, medicalCase, medicalCase.nodes[finalDiagnostic.id])) || title === 'additional' || title === 'custom') {
        return (
          <Card key={finalDiagnostic.id}>
            <CardItem style={styles.cardItemCondensed}>
              <Body style={styles.cardTitleContent}>
                <LiwiTitle2 noBorder style={styles.flex}>
                  {translateText(finalDiagnostic.label, algorithmLanguage)}
                  {'\n'}
                  <Text note>{t(`diagnoses_label:${title}`)}</Text>
                </LiwiTitle2>
                {title !== 'custom' && (
                  <View style={styles.tooltipButtonFinalDiagnostic}>
                    <View flex>
                      <TouchableOpacity style={styles.touchable} transparent onPress={() => this.openModal(algorithm.nodes[finalDiagnostic.id])}>
                        <Icon type="AntDesign" name="info" style={styles.iconInfo} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </Body>
            </CardItem>
            <CardItem style={styles.cardItemCondensed}>
              <Body>

                <LiwiTitle2 noBorder style={styles.cardTitle}>
                  {t('diagnoses:medicines')}
                </LiwiTitle2>

                {finalDiagnostic.drugs !== undefined && Object.keys(finalDiagnostic.drugs).length > 0 ? (
                  title === 'custom' ? (
                    finalDiagnostic.drugs.map((drug) => (
                      <View style={styles.drugContainer} key={drug}>
                        <Text>{drug}</Text>
                      </View>
                    ))
                  ) : (
                    Object.keys(finalDiagnostic.drugs).map((drugKey) => {
                      if (drugsAvailable[drugKey] !== undefined) {
                        return (
                          <View style={styles.drugContainer} key={drugKey}>
                            <View style={{ flex: 1 }}>{this._renderSwitchFormulation(drugsAvailable[drugKey])}</View>
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
                {finalDiagnostic.managements !== undefined && Object.keys(finalDiagnostic.managements).length > 0 ? (
                  Object.keys(finalDiagnostic.managements).map((managementKey) => {
                    const management = finalDiagnostic.managements[managementKey];
                    const node = algorithm.nodes[management.id];
                    if (calculateCondition(algorithm, management) === true && management.agreed === true) {
                      return (
                        <View style={styles.drugContainer} key={`${managementKey}_management`}>
                          <View style={{ flex: 1, marginTop: 15 }}>
                            <Text size-auto>{translateText(node.label, algorithmLanguage)}</Text>
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

    return (<ScrollView>{['proposed', 'additional', 'custom'].map((key) => this._renderFinalDiagnosticCards(medicalCase.diagnoses[key], key))}</ScrollView>);
  }
}
