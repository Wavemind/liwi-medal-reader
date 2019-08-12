// @flow

import * as React from 'react';
import { Tab, Tabs, Text, View } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { Image } from 'react-native';
import { styles } from './PatientSummary.style';
import Questions from '../../../components/QuestionsContainer/Questions';
import { LiwiTabStyle, LiwiTitle2 } from '../../../template/layout';
import BackButton from '../../../components/uix/backButton';
import { nodesType } from '../../../../frontend_service/constants';

type Props = NavigationScreenProps & {};
type State = {};

export default class PatientProfile extends React.Component<Props, State> {
  state = {};

  render() {
    const {
      medicalCase: { nodes, patient, vitalSigns },
      app: { t },
      navigation,
    } = this.props;


    let fd = nodes.filterByType(nodesType.fd);

    let defaultTab = navigation.getParam('defaultTab');

    const items = [];

    for (const [index, value] of fd.entries()) {
      items.push(
        <Text>
          {index} - {value.name}
        </Text>
      );
    }

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
                {patient.firstname} - {patient.lastname} | {patient.gender} | {patient.birthdate}
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
              <View>{items}</View>
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
