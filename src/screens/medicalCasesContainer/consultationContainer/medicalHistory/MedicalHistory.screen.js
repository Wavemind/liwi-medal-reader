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

    // symptom and counter and stage = consultation

    let SymptomsCounterStage = medicalCase.nodes.filterByMultiple([
      { by: 'category', operator: 'equal', value: categories.symptom },
      { by: 'stage', operator: 'equal', value: stage.consultation },
      { by: 'counter', operator: 'more', value: 0 },
    ]);

    return (
      <ScrollView>
        <Tabs tabBarUnderlineStyle={LiwiTabStyle.tabBarUnderlineStyle}>
          <Tab
            heading="Symtom Counter Stage(consultation)"
            tabStyle={LiwiTabStyle.tabStyle}
            activeTextStyle={LiwiTabStyle.activeTextStyle}
            textStyle={LiwiTabStyle.textStyle}
            activeTabStyle={LiwiTabStyle.activeTabStyle}
          >
            <Questions questions={SymptomsCounterStage} />
          </Tab>
        </Tabs>
      </ScrollView>
    );
  }
}
