// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import { Button, Icon, Input, Item, View, Text, Picker, List, ListItem } from 'native-base';

import { styles } from './PatientList.style';
import { LiwiTitle2, SeparatorLine } from '../../../template/layout';

type Props = {}
type State = {};

export default class PatientList extends React.Component<Props, State> {
  state = {};

  render() {
    return (
      <ScrollView>
        <View padding-auto>
          <LiwiTitle2 noBorder>Search</LiwiTitle2>

          <View flex-container-row>
            <Item round style={styles.input}>
              <Icon active name='search'/>
              <Input/>
            </Item>
            <Button center rounded light>
              <Icon
                type={'MaterialCommunityIcons'}
                name="plus"
              />
            </Button>
          </View>

          <View flex-container-row style={styles.filter}>
            <Button center rounded light>
              <Text>ALL</Text>
            </Button>
            <Text style={styles.textFilter}>PATIENTS WAITING FOR</Text>
            <Picker
              style={styles.picker}
              mode="dropdown"
            >
              <Picker.Item label="TRIAGE (11)" value="triage" />
              <Picker.Item label="UNKNOWN (0)" value="unknown" />
            </Picker>
          </View>

          <SeparatorLine />

          <View flex-container-row style={styles.sorted}>
            <Text style={styles.textSorted}>SORT BY</Text>
            <Button center rounded light>
              <Icon name='arrow-up' />
              <Text>Name</Text>
            </Button>
            <Button center rounded light>
              <Icon name='arrow-down' />
              <Text>Status</Text>
            </Button>
          </View>

          <List block>
            <ListItem rounded block spaced>
              <View w50><Text>Quentin Girard</Text></View>
              <View w50><Text>Waiting for triage</Text></View>
            </ListItem>
          </List>

        </View>
      </ScrollView>
    );
  }
}
