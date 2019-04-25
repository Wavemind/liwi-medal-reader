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
import { NavigationScreenProps } from 'react-navigation';
import Questions from '../../../components/QuestionsContainer/Questions';
import { liwiColors } from '../../../utils/constants';
import { LiwiTitle2 } from '../../../template/layout';
import { styles } from './WorkCase.style';

type Props = NavigationScreenProps & {};
type State = {};

export default class WorkCase extends React.Component<Props, State> {
  state = { ready: true };

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

    // Tabs name
    let tabBatches = [
      { name: 'Triage', current: false, nodes: {} },
      { name: 'Mandatory', current: false, nodes: {} },
      { name: '3', current: false, nodes: {} },
      { name: '4', current: false, nodes: {} },
      { name: '5', current: false, nodes: {} },
      { name: '6', current: false, nodes: {} },
    ];

    let ready = true;

    // Generate batches with question is not answered
    batches.map((batch, id) => {
      batch.nodes.map((nodeId) => {
        if (nodes[nodeId].answer === null) {
          ready = false;
        }
        tabBatches[id].nodes[nodeId] = nodes[nodeId];
      });
    });

    console.log(batches, tabBatches)

    return (
      <View style={styles.container}>
        <LiwiTitle2>Version : {version}</LiwiTitle2>
        <View style={styles.view}>
          <Text>description : {description}</Text>
          <Text>Par : {author}</Text>
        </View>
        <Button onPress={() => nextBatch()}>
          <Icon name="forward" type={'AntDesign'}/>
          <Text>Créer le batch suivant</Text>
        </Button>
        <Tabs>
          {Object.keys(tabBatches).map((batchId) =>
            Object.keys(tabBatches[batchId].nodes).length > 0 ? (
              <Tab
                heading={tabBatches[batchId].name}
                tabStyle={{
                  backgroundColor: liwiColors.redColor,
                }}
                activeTabStyle={{
                  backgroundColor: liwiColors.redColor,
                }}
              >
                <Questions questions={tabBatches[batchId].nodes}/>
              </Tab>
            ) : null,
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
            <View style={styles.flex}>
              {Object.keys(diseases).map((id) => (
                <View
                  style={styles.diseases}
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
