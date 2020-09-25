// @flow

import * as React from 'react';
import { Button, Icon } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { styles } from './BackButton.style';

type Props = NavigationScreenProps & {};

// TODO: used only in medical case summary
export default function BackButton(props: Props) {
  const { navigation } = props;
  return (
    <Button onPress={() => navigation.goBack()} rounded style={styles.button}>
      <Icon name="close" type="AntDesign" style={styles.icon} />
    </Button>
  );
}
