// @flow

import * as React from 'react';
import {
  Text,
  View,
  List,
  ListItem,
  Left,
  Body,
  Button,
  Switch,
  Right,
  Icon,
} from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { ScrollView } from 'react-native';

type Props = NavigationScreenProps & {};

type State = {};

export default class Settings extends React.Component<Props, State> {
  state = {};

  componentWillMount() {}

  render() {
    const {} = this.props;

    return (
      <View>
        <List>
          <ListItem itemDivider>
            <Text>Application</Text>
          </ListItem>
          <ListItem>
            <Left>
              <Button iconLeft iconMenu>
                <Icon grey type={'FontAwesome'} name="eye" />
              </Button>
            </Left>
            <Body>
              <Text>Empécher la mise en veille</Text>
            </Body>
            <Right>
              <Switch value={true} />
            </Right>
          </ListItem>
          <ListItem>
            <Text>Autre</Text>
          </ListItem>
          <ListItem itemDivider>
            <Text>Médical</Text>
          </ListItem>
          <ListItem>
            <Text>Afficher les questions cachées</Text>
          </ListItem>
        </List>
      </View>
    );
  }
}
