// @flow

import * as React from 'react';
import { Tab, Tabs, Text, View, H2 } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { ScrollView } from 'react-native';
import { getItemFromArray } from '../../../engine/api/LocalStorage';
import Questions from '../../../components/QuestionsContainer/Questions';
import { liwiColors, screenHeight } from '../../../utils/constants';
import { QuestionView } from '../../../template/layout';
import find from 'lodash/find';

type Props = NavigationScreenProps & {};

type State = {};

export default class Algorithme extends React.Component<Props, State> {
  state = { ready: false };

  async componentWillMount() {
    const { navigation } = this.props;
    let algoId = navigation.getParam('algoId');
    let algoVersion = navigation.getParam('algoVersion');
    let algo = await getItemFromArray('algorithmes', 'algorithm_id', algoId);
    let version = find(algo.versions, (al) => al.version === algoVersion);
    await this.setState({
      ...version,
      ready: true,
    });
  }

  render() {
    const { questions, ready, diseases } = this.state;

    if (!ready) {
      return null;
    }

    let questiontriage = Object.keys(questions).map(
      (id) => questions[id].priority === 'triage'
    );

    return (
      <View style={{ height: screenHeight, paddingBottom: 80 }}>
        <H2>Questions</H2>
        <Tabs>
          <Tab
            heading="Questions triage"
            tabStyle={{
              backgroundColor: liwiColors.redColor,
            }}
            activeTabStyle={{
              backgroundColor: liwiColors.redColor,
            }}
          >
            <Questions questions={questions} />
          </Tab>
          <Tab
            heading="Questions normales"
            tabStyle={{
              backgroundColor: liwiColors.redColor,
            }}
            activeTabStyle={{
              backgroundColor: liwiColors.redColor,
            }}
          >
            <Questions questions={questions} />
          </Tab>
          <Tab
            heading="Diagnostic"
            tabStyle={{
              backgroundColor: liwiColors.redColor,
            }}
            activeTabStyle={{
              backgroundColor: liwiColors.redColor,
            }}
          >
            <View>
              {Object.keys(diseases).map((id) => (
                <QuestionView
                  style={{ margin: 10, padding: 10, flex: 1 }}
                  key={id + '_diseases'}
                >
                  <Text>{diseases[id].id}</Text>
                  <Text>{diseases[id].reference}</Text>
                  <Text>{diseases[id].label}</Text>
                </QuestionView>
              ))}
            </View>
          </Tab>
        </Tabs>
      </View>
    );
  }
}
