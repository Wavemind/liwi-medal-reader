// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import find from 'lodash/find';
import { Tab, Tabs, Text, View } from 'native-base';
import { getItemFromArray } from '../../../engine/api/LocalStorage';
import Questions from '../../../components/QuestionsContainer/Questions';
import { LiwiTitle2 } from '../../../template/layout';
import { liwiColors, screenHeight } from '../../../utils/constants';

type Props = NavigationScreenProps & {};
type State = {};

// Display content of an algorithm
// TODO : useful or useless ?
export default class Algorithm extends React.Component<Props, State> {
  state = { ready: false, empty: false };

  async componentWillMount() {
    const { navigation } = this.props;
    let algorithmId = navigation.getParam('algoId');
    let algorithmVersion = navigation.getParam('algoVersion');
    let algorithm = await getItemFromArray(
      'algorithms',
      'algorithm_id',
      algorithmId
    );

    if (algorithm === undefined) {
      this.setState({
        ready: true,
        empty: true,
      });
    } else {
      let version = find(
        algorithm?.versions,
        (al) => al.version === algorithmVersion
      );

      await this.setState({
        ...version,
        ready: true,
      });
    }
  }

  render() {
    const {
      nodes,
      ready,
      diagnostics,
      version,
      description,
      author,
      empty,
    } = this.state;

    if (!ready) {
      return null;
    }

    if (empty && ready) {
      return <Text>No algorithm</Text>;
    }

    let questionTriage = {};
    let questionNormals = {};

    Object.keys(nodes).map((id) => {
      nodes[id].priority === 'triage'
        ? (questionTriage[id] = nodes[id])
        : (questionNormals[id] = nodes[id]);
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
              {Object.keys(diagnostics).map((id) => (
                <View
                  style={{
                    margin: 10,
                    padding: 20,
                    backgroundColor: liwiColors.greyColor,
                  }}
                  key={id + '_diagnostics'}
                >
                  <Text>id : {diagnostics[id].id}</Text>
                  <Text>reference : {diagnostics[id].reference}</Text>
                  <Text>label : {diagnostics[id].label}</Text>
                </View>
              ))}
            </View>
          </Tab>
        </Tabs>
      </View>
    );
  }
}
