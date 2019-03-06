// @flow

import * as React from 'react';
import {
  Tab,
  Tabs,
  Text,
  View,
  Icon,
  Button,
} from 'native-base';
import {NavigationScreenProps} from 'react-navigation';
import {ScrollView} from 'react-native';
import Questions from '../../../components/QuestionsContainer/Questions';
import {liwiColors, screenHeight} from '../../../utils/constants';
import {LiwiTitle2} from '../../../template/layout';

type Props = NavigationScreenProps & {};

type State = {};

export default class WorkCase extends React.Component<Props, State> {
  state = {ready: true};

  render() {
    const {
      nextBatch,
      medicalCase: {
        nodes,
        diseases,
        version,
        description,
        author,
        batches,
      },
    } = this.props;

    let ready = true;

    let questionsBatched = [
      {name: 'Questions de triage', current: false, nodes: {}},
      {name: '2', current: false, nodes: {}},
      {name: '3', current: false, nodes: {}},
      {name: '4', current: false, nodes: {}},
      {name: '5', current: false, nodes: {}},
      {name: '6', current: false, nodes: {}},
    ];

    batches.map((batch, id) => {
      batch.nodes.map((nodeId) => {
        if (nodes[nodeId].answer === null) {
          ready = false;
        }
        questionsBatched[id].nodes[nodeId] = nodes[nodeId];
      });
    });

    return (
      <View style={{height: screenHeight, paddingBottom: 80}}>
        <LiwiTitle2>Version : {version}</LiwiTitle2>
        <View style={{padding: 20}}>
          <Text>description : {description}</Text>
          <Text>Par : {author}</Text>
        </View>
        <Button onPress={() => nextBatch()}
          // disabled={!ready}
        >
          <Icon name="forward" type={'AntDesign'}/>
          <Text>Créer le batch suivant</Text>
        </Button>
        <Tabs>
          {Object.keys(questionsBatched).map((batchId) =>
            Object.keys(questionsBatched[batchId].nodes).length > 0 ? (
              <Tab
                heading={questionsBatched[batchId].name}
                tabStyle={{
                  backgroundColor: liwiColors.redColor,
                }}
                activeTabStyle={{
                  backgroundColor: liwiColors.redColor,
                }}
              >
                <Questions questions={questionsBatched[batchId].nodes}/>
              </Tab>
            ) : null
          )}
          <Tab
            heading="Diagnostic"
            tabStyle={{
              backgroundColor: liwiColors.redColor,
            }}
            activeTabStyle={{
              backgroundColor: liwiColors.redColor,
            }}
          >
            <View style={{flex: 1}}>
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
