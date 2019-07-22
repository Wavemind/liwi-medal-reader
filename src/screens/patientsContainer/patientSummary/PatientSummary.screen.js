// @flow

import * as React from 'react';
import { Tab, Tabs, Text, View } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { Image } from 'react-native';
import { styles } from './PatientSummary.style';
import { liwiColors } from '../../../utils/constants';
import Questions from '../../../components/QuestionsContainer/Questions';
import { LiwiTitle2 } from '../../../template/layout';
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

    const styleImage = {
      width: 40,
      height: 40,
    };
    let fd = nodes.filterByType(nodesType.fd);

    let defaultTab = navigation.getParam('defaultTab');

    const items = [];

    for (const [index, value] of fd.entries()) {
      items.push(<Text>{index} - {value.name}</Text>);
    }

    return (
      <View>
        <View style={styles.summary}>
          <BackButton />
          <LiwiTitle2>Current Summary</LiwiTitle2>
          <View>
            <View>
              <Image
                resizeMode="contain"
                style={styleImage}
                source={require('../../../../assets/images/profil.png')}
              />
            </View>
            <View>
              <Text>
                {patient.firstname} - {patient.lastname} | {patient.gender} |
                20.02.2015
              </Text>
              <Text>
                T {vitalSigns.tempetature}C | F.C {vitalSigns.respiratoryRate}{' '}
                bpm
              </Text>
            </View>
            <View>
              <Text>Edit</Text>
            </View>
          </View>
          <Tabs
            initialPage={defaultTab}
            tabBarUnderlineStyle={{
              backgroundColor: liwiColors.redColor,
            }}
          >
            <Tab
              heading={t('summary:diagnoses')}
              tabStyle={{
                borderColor: liwiColors.darkGreyColor,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                borderWidth: 1,
                borderRadius: 10,
                // opacity: 0.5,
              }}
              activeTextStyle={{
                color: liwiColors.redColor,
              }}
              textStyle={{
                color: liwiColors.blackColor,
              }}
              activeTabStyle={{
                borderColor: liwiColors.redColor,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                borderWidth: 1,
                borderRadius: 10,
              }}
            >
              <View>{items}</View>
            </Tab>
            <Tab
              heading="All questions"
              tabStyle={{
                borderColor: liwiColors.darkGreyColor,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                borderWidth: 1,
                borderRadius: 10,
              }}
              activeTextStyle={{
                color: liwiColors.redColor,
              }}
              textStyle={{
                color: liwiColors.blackColor,
              }}
              activeTabStyle={{
                borderColor: liwiColors.redColor,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                borderWidth: 1,
                borderRadius: 10,
              }}
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
