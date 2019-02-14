// @flow

import * as React from 'react';
import { Tab, Tabs, Text, View, H2, H3 } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { ScrollView } from 'react-native';
import { getItemFromArray } from '../../../engine/api/LocalStorage';
import Questions from '../../../components/QuestionsContainer/Questions';
import { liwiColors, screenHeight } from '../../../utils/constants';
import { LiwiTitle2, LiwiTitle3, QuestionView } from '../../../template/layout';
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
    const { nodes, ready, diseases, version, description, author } = this.state;

    if (!ready) {
      return null;
    }

    let questionTriage = {};
    let questionNormals = {};
    Object.keys(nodes).map((id) => {
      switch (nodes[id].type) {
        case 'Question':
          nodes[id].priority === 'triage'
            ? (questionTriage[id] = nodes[id])
            : (questionNormals[id] = nodes[id]);
          break;
      }
    });

    return (
      <View style={{ height: screenHeight, paddingBottom: 80 }}>
        <LiwiTitle2>Version : {version}</LiwiTitle2>
        <View style={{ padding: 20 }}>
          <Text>description : {description}</Text>
          <Text>Par : {author}</Text>
        </View>
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
            <Questions questions={questionTriage} />
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
            <Questions questions={questionNormals} />
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
            <View style={{ flex: 1 }}>
              {Object.keys(diseases).map((id) => (
                <View
                  style={{
                    margin: 10,
                    padding: 20,
                    backgroundColor: liwiColors.greyColor,
                  }}
                  key={id + '_diseases'}
                >
                  <Text>id : {diseases[id].id}</Text>
                  <Text>reference : {diseases[id].reference}</Text>
                  <Text>label : {diseases[id].label}</Text>
                </View>
              ))}
            </View>
          </Tab>
        </Tabs>
      </View>
    );
  }
}
