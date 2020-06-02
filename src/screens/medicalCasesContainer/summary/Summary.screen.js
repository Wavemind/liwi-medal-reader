// @flow

import * as React from 'react';
import { Content, Tab, Tabs, View, Text } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { styles } from './Summary.style';
import Questions from '../../../components/QuestionsContainer/Questions';
import { LiwiTabStyle, LiwiTitle2 } from '../../../template/layout';
import BackButton from '../../../components/BackButton';
import FinalDiagnosticsList from '../../../components/FinalDiagnosticsList';

type Props = NavigationScreenProps & {};
type State = {};

export default class Summary extends React.Component<Props, State> {
  state = {};

  render() {
    const {
      medicalCase,
      app: { t },
      navigation,
    } = this.props;

    let nodes = medicalCase.nodes;

    if (medicalCase.nodes === undefined) {
      nodes = navigation.getParam('medicalCase').nodes;
    }

    const defaultTab = navigation.getParam('defaultTab');

    return (
      <View padding-auto flex>
        <BackButton />
        <LiwiTitle2 marginTop>{t('summary:title')}</LiwiTitle2>
        <Tabs initialPage={defaultTab} tabBarUnderlineStyle={LiwiTabStyle.tabBarUnderlineStyle}>
          <Tab
            heading={t('summary:diagnoses')}
            tabStyle={LiwiTabStyle.tabStyle}
            activeTextStyle={LiwiTabStyle.activeTextStyle}
            textStyle={LiwiTabStyle.textStyle}
            activeTabStyle={LiwiTabStyle.activeTabStyle}
          >
            <Content style={styles.marginTop}>
              <Text>Coucou</Text>
            </Content>
          </Tab>
          <Tab heading="All questions" tabStyle={LiwiTabStyle.tabStyle} activeTextStyle={LiwiTabStyle.activeTextStyle} textStyle={LiwiTabStyle.textStyle} activeTabStyle={LiwiTabStyle.activeTabStyle}>
            <View>
              <Questions questions={nodes} />
            </View>
          </Tab>
        </Tabs>
      </View>
    );
  }
}
