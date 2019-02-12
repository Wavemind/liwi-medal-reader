// @flow

import * as React from 'react';
import { Tab, Tabs, Text, View } from 'native-base';
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
    const { navigation } = this.props;

    const { questions, ready, predefined_syndromes, diseases } = this.state;

    if (!ready) {
      return null;
    }

    return (
      <View style={{ height: screenHeight, paddingBottom: 80 }}>
        <Tabs>
          <Tab
            heading="Questions"
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
            heading="Syndroms"
            tabStyle={{
              backgroundColor: liwiColors.redColor,
            }}
            activeTabStyle={{
              backgroundColor: liwiColors.redColor,
            }}
          >
            <View>
              {Object.keys(predefined_syndromes).map((predefId) => (
                <QuestionView
                  style={{ margin: 10, padding: 10 }}
                  key={predefId + '_predefined_syndromes'}
                >
                  <Text>{predefined_syndromes[predefId].id}</Text>
                  <Text>{predefined_syndromes[predefId].label}</Text>
                </QuestionView>
              ))}
            </View>
          </Tab>
          <Tab
            heading="Diseases"
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
                  style={{ margin: 10, padding: 10 }}
                  key={id + '_diseases'}
                >
                  <Text>{diseases[id].id}</Text>
                  <Text>{diseases[id].name}</Text>
                </QuestionView>
              ))}
            </View>
          </Tab>
        </Tabs>
      </View>
    );
  }
}
