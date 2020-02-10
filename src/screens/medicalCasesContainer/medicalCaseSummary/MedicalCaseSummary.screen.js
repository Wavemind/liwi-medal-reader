// @flow

import * as React from 'react';
import { Content, Tab, Tabs, Text, View } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import find from 'lodash/find';
import { styles } from './MedicalCaseSummary.style';
import Questions from '../../../components/QuestionsContainer/Questions';
import { LiwiTabStyle, LiwiTitle2 } from '../../../template/layout';
import BackButton from '../../../components/BackButton';
import FinalDiagnosticsList from '../../../components/FinalDiagnosticsList';

type Props = NavigationScreenProps & {};
type State = {};

export default class MedicalCaseSummary extends React.Component<Props, State> {
  state = {};

  render() {
    const {
      medicalCase: { nodes, patient },
      app: { t },
      navigation,
    } = this.props;

    let defaultTab = navigation.getParam('defaultTab');

    const age = find(nodes, { reference: '2', category: 'demographic' });
    let stringAge;
    if (age !== undefined) {
      stringAge = age.value === null ? 'Age is not defined' : age.value + ' months';
    }

    return (
      <View padding-auto flex>
        <BackButton />
        <LiwiTitle2 marginTop>{t('summary:title')}</LiwiTitle2>
        <View style={styles.patientInfo}>
          <View flex-container-fluid>
            <Text size-auto>
              {patient.firstname} {patient.lastname}
            </Text>
            <Text size-auto>{patient.gender}</Text>
            <Text size-auto>{stringAge}</Text>
          </View>
        </View>
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
          <Tab
            heading="All questions"
            tabStyle={LiwiTabStyle.tabStyle}
            activeTextStyle={LiwiTabStyle.activeTextStyle}
            textStyle={LiwiTabStyle.textStyle}
            activeTabStyle={LiwiTabStyle.activeTabStyle}
          >
            <View>
              <Questions questions={nodes} />
            </View>
          </Tab>
        </Tabs>
      </View>
    );
  }
}
