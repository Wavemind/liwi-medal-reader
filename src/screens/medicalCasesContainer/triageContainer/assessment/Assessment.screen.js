// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import { Input, List, ListItem, Text, View, Item, Label, Icon, Picker } from 'native-base';

import { LiwiTitle2, LeftButton, RightButton } from '../../../../template/layout';
import i18n from '../../../../utils/i18n';
import { styles } from '../../../patientsContainer/patientList/PatientList.style';

type Props = {};
type State = {};

export default class Assessment extends React.Component<Props, State> {

  render() {
    return (
      <ScrollView>
        <View padding-auto>
          <LiwiTitle2 noBorder>{i18n.t('assessment:title')}</LiwiTitle2>
          <List block>
            <ListItem
              block
              noBorder
            >
              <View question>
                <Text>
                  Chabat chabit ou les deux Chabat chabit ou les deux Chabat chabit ou les deux Chabat chabit ou les deux Chabat chabit ou les deux
                </Text>
              </View>
              <View answer>
                <LeftButton active>
                  <Text white center>Oui</Text>
                </LeftButton>
                <RightButton>
                  <Text center>Non</Text>
                </RightButton>
              </View>
            </ListItem>

            <ListItem
              block
              noBorder
            >
              <View question>
                <Text>
                  Chabat chabit ou les deux Chabat chabit ou les deux Chabat chabit ou les deux Chabat chabit ou les deux Chabat chabit ou les deux
                </Text>
              </View>
              <View answer>
                <Item round>
                  <Input keyboardType="number-pad"/>
                </Item>
              </View>
            </ListItem>

            <ListItem
              block
              noBorder
            >
              <View question>
                <Text>
                  Chabat chabit ou les deux Chabat chabit ou les deux Chabat chabit ou les deux Chabat chabit ou les deux Chabat chabit ou les deux
                </Text>
              </View>
              <View answer>
                <Item round>
                  <Picker mode="dropdown">
                    <Picker.Item label="" value=""/>
                    <Picker.Item label="TRIAGE (11)" value="triage"/>
                    <Picker.Item label="UNKNOWN (0)" value="unknown"/>
                  </Picker>
                </Item>
              </View>
            </ListItem>
          </List>
        </View>
      </ScrollView>
    );
  }
}
