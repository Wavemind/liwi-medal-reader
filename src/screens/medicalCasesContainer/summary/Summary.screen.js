// @flow

import * as React from 'react';
import { Content, Tab, Tabs, View, Text } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';

import { styles } from './Summary.style';
import Questions from '../../../components/QuestionsContainer/Questions';
import { LiwiTabStyle } from '../../../template/layout';
import BackButton from '../../../components/BackButton';
import FinalDiagnosticCards from '../../../components/FinalDiagnosticCards';
import { questionDisplayValue } from '../../../../frontend_service/engine/models/Question.model';

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

    this.state = {
      medicalCase: currentMedicalCase,
      nodes,
    };
  }

  render() {
    const {
      app: { t, algorithm },
    } = this.props;

    const { medicalCase, nodes } = this.state;

    return (
      <View padding-auto flex>
        <BackButton />
        <View style={styles.patientContainer}>
          <View flex>
            <Text size-auto>{questionDisplayValue(algorithm, nodes[medicalCase.mobile_config.left_top_question_id])}</Text>
          </View>
          <View style={styles.alignRight}>
            <Text size-auto>
              {questionDisplayValue(algorithm, nodes[medicalCase.mobile_config.first_top_right_question_id])} {questionDisplayValue(algorithm, nodes[medicalCase.mobile_config.second_top_right_question_id])}
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
            <View>
              <Questions questions={nodes} isReadOnly />
            </View>
          </Tab>
        </Tabs>
      </View>
    );
  }
}
