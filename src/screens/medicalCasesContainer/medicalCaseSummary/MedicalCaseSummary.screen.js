// @flow

import * as React from 'react';
import { Tab, Tabs, Text, View, Icon, Content } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import moment from 'moment';
import { styles } from './MedicalCaseSummary.style';
import Questions from '../../../components/QuestionsContainer/Questions';
import { LiwiTabStyle, LiwiTitle2 } from '../../../template/layout';
import BackButton from '../../../components/uix/backButton';
import { nodesType } from '../../../../frontend_service/constants';
import { liwiColors } from '../../../utils/constants';

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

    let finalDiagnostics = nodes.filterByType(nodesType.finalDiagnostic);
    let defaultTab = navigation.getParam('defaultTab');

    const items = [];

    // eslint-disable-next-line no-unused-vars
    for (let index in finalDiagnostics) {
      if (finalDiagnostics.hasOwnProperty(index)) {
        let finalDiagnostic = finalDiagnostics[index];
        let condition = finalDiagnostic.calculateCondition();

        let type;
        let style = {};
        let name;

        switch (condition) {
          case true:
            type = 'AntDesign';
            name = 'checkcircle';
            style.color = liwiColors.greenColor;
            break;
          case false:
            type = 'Entypo';
            name = 'circle-with-cross';
            style.color = liwiColors.redColor;
            break;
          case null:
            type = 'AntDesign';
            name = 'minuscircleo';
            style.color = liwiColors.darkerGreyColor;
            break;
        }

        items.push(
          <Text style={styles.spaceText} size-auto>
            <Icon type={type} name={name} style={style} /> -{' '}
            {finalDiagnostic.id} - {finalDiagnostic.label}
          </Text>
        );
      }
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
            <Text size-auto>
              {moment(patient.birthdate).format('d MMMM YYYY')}
            </Text>
          </View>
        </View>
        <Tabs
          initialPage={defaultTab}
          tabBarUnderlineStyle={LiwiTabStyle.tabBarUnderlineStyle}
        >
          <Tab
            heading={t('summary:diagnoses')}
            tabStyle={LiwiTabStyle.tabStyle}
            activeTextStyle={LiwiTabStyle.activeTextStyle}
            textStyle={LiwiTabStyle.textStyle}
            activeTabStyle={LiwiTabStyle.activeTabStyle}
          >
            <Content style={styles.marginTop}>{items}</Content>
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
