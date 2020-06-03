// @flow

import * as React from 'react';
import { Content, Tab, Tabs, View, Text, Card, CardItem, Body } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';

import { styles } from './Summary.style';
import Questions from '../../../components/QuestionsContainer/Questions';
import { LiwiTabStyle, LiwiTitle2, LiwiTitle4, LiwiTitle5 } from '../../../template/layout';
import BackButton from '../../../components/BackButton';
import { getDrugs } from '../../../../frontend_service/algorithm/questionsStage.algo';
import { medicationForms } from '../../../../frontend_service/constants';
import Liquid from '../../../components/Formulations/Liquid';
import Breakable from '../../../components/Formulations/Breakable';
import Capsule from '../../../components/Formulations/Capsule';
import Default from '../../../components/Formulations/Default';
import { calculateCondition } from '../../../../frontend_service/algorithm/conditionsHelpers.algo';

type Props = NavigationScreenProps & {};
type State = {};

export default class Summary extends React.Component<Props, State> {
  state = {};

  constructor(props) {
    super(props);

    const { medicalCase, navigation } = props;

    let currentMedicalCase = medicalCase;
    let { nodes } = currentMedicalCase;

    // Come from navigation
    if (nodes === undefined) {
      currentMedicalCase = navigation.getParam('medicalCase');
      nodes = currentMedicalCase.nodes;
    }

    const drugsAvailable = getDrugs(currentMedicalCase.diagnoses);

    this.state = {
      medicalCase: currentMedicalCase,
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
              <Body style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <LiwiTitle2 noBorder>{finalDiagnosticCategory[key].label}</LiwiTitle2>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <LiwiTitle2 noBorder>
                    <Text note>{t(`diagnoses_label:${title}`)}</Text>
                  </LiwiTitle2>
                </View>
              </Body>
            </CardItem>
            <CardItem bordered>
              <Body>
                <LiwiTitle4>Medication</LiwiTitle4>
                {Object.keys(finalDiagnosticCategory[key].drugs).map((drugKey) => {
                  if (drugsAvailable[drugKey] !== undefined) {
                    return this._renderSwitchFormulation(drugsAvailable[drugKey]);
                  }
                })}
              </Body>
            </CardItem>
            <CardItem bordered>
              <Body>
                <LiwiTitle4>Managements</LiwiTitle4>
                {Object.keys(finalDiagnosticCategory[key].managements).map((managementKey) => {
                  const management = finalDiagnosticCategory[key].managements[managementKey];
                  const node = nodes[management.id];
                  if (calculateCondition(management) === true) {
                    return <Text size-auto key={`${managementKey}-management`}>{node.label}</Text>;
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
    const {
      app: { t },
    } = this.props;

    const { medicalCase, nodes } = this.state;

    return (
      <View padding-auto flex>
        <BackButton />
        <Tabs tabBarUnderlineStyle={LiwiTabStyle.tabBarUnderlineStyle}>
          <Tab
            heading={t('summary:diagnoses')}
            tabStyle={LiwiTabStyle.tabStyle}
            activeTextStyle={LiwiTabStyle.activeTextStyle}
            textStyle={LiwiTabStyle.textStyle}
            activeTabStyle={LiwiTabStyle.activeTabStyle}
            style={LiwiTabStyle.style}
          >
            <Content style={styles.marginTop}>{Object.keys(medicalCase.diagnoses).map((key) => this._renderFinalDiagnosticCards(medicalCase.diagnoses[key], key))}</Content>
          </Tab>
          <Tab
            heading={t('summary:questions')}
            tabStyle={LiwiTabStyle.tabStyle}
            activeTextStyle={LiwiTabStyle.activeTextStyle}
            textStyle={LiwiTabStyle.textStyle}
            activeTabStyle={LiwiTabStyle.activeTabStyle}
          >
            <View>
              <Questions questions={nodes} />
            </View>
          </Tab>
        </Tabs>
      </View>
    );
  }
}
