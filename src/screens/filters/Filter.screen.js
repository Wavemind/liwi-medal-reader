// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import {ScrollView} from 'react-native';
import { Text, View, Button } from 'native-base';
import { styles } from './Filter.style';
import { LiwiTitle2 } from '../../template/layout';
import FilterAccordion from '../../components/FilterAccordion';
import { liwiColors } from '../../utils/constants';

type Props = NavigationScreenProps & {};
type State = {};

export default class Filter extends React.Component<Props, State> {
  render() {
    const {navigation} = this.props;

    return (
      <View padding-auto style={{ flex:1, marginTop: 50 }}>
        <ScrollView>
        <LiwiTitle2 noBorder>Filters</LiwiTitle2>

        <FilterAccordion />
        <FilterAccordion />
        <FilterAccordion />
        </ScrollView>

        <View flex-container-row style={{ bottom: 0, left: 0, right: 0, height: 100, position: 'absolute' }}>
          <View w50>
            <Button style={{left: 0, paddingLeft: 0, marginLeft: 0, width: '95%', height: '100%', borderRight: 5, borderRightColor: liwiColors.darkerGreyColor}}>
              <Text size-auto center>Clear all</Text>
            </Button>
          </View>
          <View w50>
            <Button style={{width: '100%', height: '100%', marginLeft: 0}} onPress={() => navigation.goBack()}>
              <Text size-auto center>Apply</Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }
}
