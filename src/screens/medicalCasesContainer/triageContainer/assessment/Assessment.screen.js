// @flow

import * as React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Button, List, ListItem, Text, View } from 'native-base';

import { LiwiTitle2 } from '../../../../template/layout';
import i18n from '../../../../utils/i18n';
import { liwiColors } from '../../../../utils/constants';

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
              spaced
              noBorder
            >
              <View flex-container-row style={{
                flex:0.8,
                borderRadius: 5,
                borderWidth: 1,
                padding: 15,
                marginRight: 20,
                borderColor: liwiColors.blackColor,
              }}>
                <Text>
                  Chabat chabit ou les deux
                </Text>
              </View>
              <View flex-container-row style={{
                flex:0.2,
                justifyContent: 'center',
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
                <TouchableOpacity style={{
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                  borderWidth: 1,
                  padding: 15,
                  borderColor: liwiColors.blackColor,
                  }}>
                <Text>Oui</Text>
              </TouchableOpacity>
                <TouchableOpacity style={{
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5,
                  borderWidth: 1,
                  padding: 15,
                  borderColor: liwiColors.blackColor,
                }}>
                  <Text>Non</Text>
                </TouchableOpacity>
              </View>
            </ListItem>
          </List>
        </View>
      </ScrollView>
    );
  }
}
