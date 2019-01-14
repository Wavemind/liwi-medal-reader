// @flow

import * as React from 'react';
import { Button, Text } from 'native-base';
import { TextExemple } from 'template/layout';
import { ScrollView } from 'react-native';

type Props = {};

type State = {};

export default class MainScreen extends React.Component<Props, State> {
  render(): React.Node {
    return (
      <ScrollView>
        <TextExemple customText>Custom Text</TextExemple>
        <Button large>
          <Text> Large </Text>
        </Button>
      </ScrollView>
    );
  }
}
