// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Tab, Tabs } from 'native-base';
import { ScrollView } from 'react-native';
import _ from 'lodash';

import { categories, stage } from '../../../../../frontend_service/constants';
import Questions from '../../../../components/QuestionsContainer/Questions';
import { LiwiTabStyle } from '../../../../template/layout';

type Props = NavigationScreenProps & {};

type State = {};

export default class MedicalHistory extends React.Component<Props, State> {
  // default settings
  state = {};

  render() {
    const { medicalCase } = this.props;

    let questions = medicalCase.nodes.filterByCategory(
      categories.chiefComplain
    );

    // TODO Will be implemented
    // eslint-disable-next-line no-unused-vars
    let activedChiefComplains = _.filter(
      questions,
      (n) => n.answer === Number(Object.keys(n.answers)[0])
    );

    let counterMoreZero = medicalCase.nodes.filterByCounterGreaterThanZero();
    let questionsWithOutChiefComplains = _.filter(
      counterMoreZero,
      (w) => w.category !== categories.chiefComplain
    );
    let allQuestions = _.filter(
      medicalCase.nodes,
      (w) => w.category !== categories.chiefComplain
    );
    let allQuestionsWithoutTriage = _.filter(
      medicalCase.nodes,
      (a) => a.priotity !== stage.triage
    );

    return (
      <ScrollView>
        <Tabs tabBarUnderlineStyle={LiwiTabStyle.tabBarUnderlineStyle}>
          <Tab
            heading="All counter"
            tabStyle={LiwiTabStyle.tabStyle}
            activeTextStyle={LiwiTabStyle.activeTextStyle}
            textStyle={LiwiTabStyle.textStyle}
            activeTabStyle={LiwiTabStyle.activeTabStyle}
          >
            <Questions questions={questionsWithOutChiefComplains} />
          </Tab>
          <Tab
            heading="All questions"
            tabStyle={LiwiTabStyle.tabStyle}
            activeTextStyle={LiwiTabStyle.activeTextStyle}
            textStyle={LiwiTabStyle.textStyle}
            activeTabStyle={LiwiTabStyle.activeTabStyle}
          >
            <Questions questions={allQuestions} />
          </Tab>

          <Tab
            heading="All questions no triage"
            tabStyle={LiwiTabStyle.tabStyle}
            activeTextStyle={LiwiTabStyle.activeTextStyle}
            textStyle={LiwiTabStyle.textStyle}
            activeTabStyle={LiwiTabStyle.activeTabStyle}
          >
            <Questions questions={allQuestionsWithoutTriage} />
          </Tab>
        </Tabs>
      </ScrollView>
    );
  }
}
