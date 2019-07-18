// @flow

import * as React from 'react';
import { Tab, Tabs, Text, View, Button, Icon, Accordion } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { styles } from './PatientSummary.style';
import { liwiColors } from '../../../utils/constants';
import Questions from '../../../components/QuestionsContainer/Questions';
import { LiwiTitle2 } from '../../../template/layout';
import { NavigationScreenProps } from 'react-navigation';
import BackButton from '../../../components/uix/backButton';

type Props = NavigationScreenProps & {};
type State = {};

export default class PatientProfile extends React.Component<Props, State> {
  state = {};

  render() {

    const {
      medicalCase,
    } = this.props;

    return (
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
        <View
          style={{
            height: '95%',
            width: '95%',
            margin: 20,
            padding: 20,
            backgroundColor: '#eee',
            opacity: 0.9,
          }}
        >
          <BackButton />
          <LiwiTitle2>Current Summary</LiwiTitle2>
          <Text>Patient info here</Text>
          <Tabs>
            <Tab
              key={'tabBatches'}
              heading={t('summary:diagnoses')}
              tabStyle={{
                backgroundColor: liwiColors.redColor,
              }}
              activeTabStyle={{
                backgroundColor: liwiColors.redColor,
              }}
            >
              <Questions questions={medicalCase.nodes} />
            </Tab>
            <Tab
              heading="All questions"
              tabStyle={{
                backgroundColor: liwiColors.redColor,
              }}
              activeTabStyle={{
                backgroundColor: liwiColors.redColor,
              }}
            >
              <View style={styles.flex}>
                <Text>f23f3</Text>


              </View>
            </Tab>
          </Tabs>
        </View>
      </View>
    );
  }
}
