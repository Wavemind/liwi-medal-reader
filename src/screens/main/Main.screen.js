// @flow

import * as React from 'react';
import { TextExemple } from 'template/layout';
import { ScrollView } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { Button, Text } from 'native-base';
import MedicalCases from '../medicalCasesContainer/medicalCases/';

type Props = NavigationScreenProps & {};
type State = {};

export default class MainScreen extends React.Component<Props, State> {
  render(): React.Node {
    return (
      <ScrollView>
        <TextExemple customText>Bienvenue</TextExemple>
        <Button large onPress={() => this.props.navigation.openDrawer()}>
          <Text> Ouvrir le menu </Text>
        </Button>
        <MedicalCases />
      </ScrollView>
    );
  }
}
