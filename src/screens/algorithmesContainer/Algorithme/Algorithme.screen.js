// @flow

import * as React from 'react';
import { Tab, Tabs, Text, View } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { ScrollView } from 'react-native';
import { getItemFromArray } from '../../../engine/api/LocalStorage';
import Questions from '../../../components/QuestionsContainer/Questions';
import { liwiColors, screenHeight } from '../../../utils/constants';
import { QuestionView } from '../../../template/layout';

type Props = NavigationScreenProps & {};

type State = {};

export default class Algorithme extends React.Component<Props, State> {
  state = { ready: false };

  async componentWillMount() {
    const { navigation } = this.props;
    let algoId = navigation.getParam('algoId');
    let algo = await getItemFromArray('algorithmes', 'algorithm_id', algoId);
    await this.setState({
      ...algo,
      ready: true,
    });
  }

  render() {
    const { navigation } = this.props;

    const { json, ready } = this.state;

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
            <Questions questions={json.questions} />
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
              {Object.keys(json.predifinedSyndroms).map((predefId) => (
                <QuestionView style={{ margin: 10, padding: 10 }}>
                  <Text>{json.predifinedSyndroms[predefId].id}</Text>
                  <Text>{json.predifinedSyndroms[predefId].label}</Text>
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
              {Object.keys(json.diseases).map((id) => (
                <QuestionView style={{ margin: 10, padding: 10 }}>
                  <Text>{json.diseases[id].id}</Text>
                  <Text>{json.diseases[id].name}</Text>
                </QuestionView>
              ))}
              <MyComponent />
            </View>
          </Tab>
        </Tabs>
      </View>
    );
  }
}
