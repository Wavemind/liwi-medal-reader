// @flow

import * as React from "react";
import { Content, Tab, Tabs, View } from "native-base";
import { NavigationScreenProps } from "react-navigation";
import { styles } from "./MedicalCaseSummary.style";
import Questions from "../../../components/QuestionsContainer/Questions";
import { LiwiTabStyle, LiwiTitle2 } from "../../../template/layout";
import BackButton from "../../../components/BackButton";
import FinalDiagnosticsList from "../../../components/FinalDiagnosticsList";

type Props = NavigationScreenProps & {};
type State = {};

export default class MedicalCaseSummary extends React.Component<Props, State> {
  state = {};

  render() {
    const {
      medicalCase: { nodes },
      app: { t },
      navigation,
    } = this.props;

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
              <FinalDiagnosticsList />
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
