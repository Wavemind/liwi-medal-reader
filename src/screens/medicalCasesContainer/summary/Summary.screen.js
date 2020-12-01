// @flow

import * as React from 'react';
import { Content, Tab, Tabs, View, Text } from 'native-base';
import * as _ from 'lodash';
import moment from 'moment';

import { styles } from './Summary.style';
import Questions from '../../../components/QuestionsContainer/Questions';
import { LiwiTabStyle } from '../../../template/layout';
import BackButton from '../../../components/BackButton';
import FinalDiagnosticCards from '../../../components/FinalDiagnosticCards';
import { questionDisplayValue } from '../../../../frontend_service/helpers/Question.model';
import { categories } from '../../../../frontend_service/constants';

export default class Summary extends React.Component {
  constructor(props) {
    super(props);

    const {
      medicalCase,
      navigation,
      app: { algorithm },
    } = props;
    let currentMedicalCase = medicalCase;
    let { nodes } = currentMedicalCase;

    // Come from navigation
    if (nodes === undefined) {
      currentMedicalCase = navigation.getParam('medicalCase');
      nodes = currentMedicalCase.nodes;
    }

    // Remove / Keep neonat question based on patient age
    const birthDate = medicalCase.nodes[algorithm.config.basic_questions.birth_date_question_id].value;
    const neonatCCs = algorithm.mobile_config.questions_orders[categories.complaintCategory].filter((ccId) => algorithm.nodes[ccId].is_neonat);
    const days = birthDate !== null ? moment(medicalCase.created_at).diff(birthDate, 'days') : 0;

    Object.keys(nodes).forEach((nodeId) => {
      const mcNode = algorithm.nodes[nodeId];
      // If patient is older than 60 days, we remove YI questions
      if (days > 60 && mcNode.conditioned_by_cc !== undefined && mcNode.conditioned_by_cc.length > 0 && mcNode.conditioned_by_cc.some((ccId) => neonatCCs.includes(ccId))) {
        delete nodes[nodeId];
      }
    });

    const arrayNodes = _.values(nodes);

    this.state = {
      medicalCase: currentMedicalCase,
      nodes,
      arrayNodes,
    };
  }

  render() {
    const {
      app: { t, algorithm },
    } = this.props;

    const { medicalCase, nodes, arrayNodes } = this.state;

    return (
      <View padding-auto flex>
        <BackButton />
        <View style={styles.patientContainer}>
          <View flex>
            <Text size-auto>{questionDisplayValue(algorithm, nodes[algorithm.mobile_config.left_top_question_id])}</Text>
          </View>
          <View style={styles.alignRight}>
            <Text size-auto>
              {questionDisplayValue(algorithm, nodes[algorithm.mobile_config.first_top_right_question_id])}{' '}
              {questionDisplayValue(algorithm, nodes[algorithm.mobile_config.second_top_right_question_id])}
            </Text>
          </View>
        </View>
        <Tabs tabBarUnderlineStyle={LiwiTabStyle.tabBarUnderlineStyle}>
          <Tab
            heading={t('summary:diagnoses')}
            tabStyle={LiwiTabStyle.tabStyle}
            activeTextStyle={LiwiTabStyle.activeTextStyle}
            textStyle={LiwiTabStyle.textStyle}
            activeTabStyle={LiwiTabStyle.activeTabStyle}
            style={LiwiTabStyle.style}
          >
            <Content style={styles.marginTop}>
              <FinalDiagnosticCards medicalCase={medicalCase} />
            </Content>
          </Tab>
          <Tab
            heading={t('summary:questions')}
            tabStyle={LiwiTabStyle.tabStyle}
            activeTextStyle={LiwiTabStyle.activeTextStyle}
            textStyle={LiwiTabStyle.textStyle}
            activeTabStyle={LiwiTabStyle.activeTabStyle}
          >
            <Content
              style={{flex: 1}}
              contentContainerStyle={{flex: 1}} // important!
            >
              <Questions questions={arrayNodes} isReadOnly />
            </Content>
          </Tab>
        </Tabs>
      </View>
    );
  }
}
