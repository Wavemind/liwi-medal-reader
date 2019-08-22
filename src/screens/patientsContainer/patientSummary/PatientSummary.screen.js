// @flow

import * as React from 'react';
import { Tab, Tabs, Text, View, Icon, Content } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { Image } from 'react-native';
import { styles } from './PatientSummary.style';
import Questions from '../../../components/QuestionsContainer/Questions';
import { LiwiTabStyle, LiwiTitle2 } from '../../../template/layout';
import BackButton from '../../../components/uix/backButton';
import { nodesType } from '../../../../frontend_service/constants';
import { calculateCondition } from '../../../../frontend_service/algorithm/algoTreeDiagnosis';
import { liwiColors } from '../../../utils/constants';

type Props = NavigationScreenProps & {};
type State = {};

export default class PatientProfile extends React.Component<Props, State> {
  state = {};

  render() {
    const {
      medicalCase: { nodes, patient, vitalSigns },
      medicalCase,
      app: { t },
      navigation,
    } = this.props;

    let fd = nodes.filterByType(nodesType.finalDiagnostic);

    let defaultTab = navigation.getParam('defaultTab');

    const items = [];

    for (const [index, value] of fd.entries()) {
      let condition = calculateCondition(medicalCase, value);

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
        <Text>
          <Icon type={type} name={name} style={style} />- {value.id} -{' '}
          {value.label}
        </Text>
      );
    }

    console.log(fd, nodes);

    return (
      <View>
        <View style={styles.summary}>
          <BackButton />
          <LiwiTitle2>{t('summary:title')}</LiwiTitle2>
          <View>
            <View>
              <Image
                resizeMode="contain"
                style={styles.image}
                source={require('../../../../assets/images/profil.png')}
              />
            </View>
            <View>
              <Text>
                {patient.firstname} - {patient.lastname} | {patient.gender} |{' '}
                {patient.birthdate}
              </Text>
              <Text>
                T {vitalSigns.tempetature}C | F.C {vitalSigns.respiratoryRate}{' '}
                bpm
              </Text>
            </View>
            <View>
              <Text>{t('form:edit')}</Text>
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
              <Content style={{ padding: 10 }}>{items}</Content>
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
      </View>
    );
  }
}
