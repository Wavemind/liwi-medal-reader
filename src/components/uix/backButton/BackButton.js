// @flow

import * as React from 'react';
import { Button, Icon } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { liwiColors } from '../../../utils/constants';

type Props = NavigationScreenProps & {};

export default function BackButton(props: Props) {
  const { navigation } = props;
  return (
    <Button
      onPress={() => navigation.goBack()}
      rounded
      style={{
        backgroundColor: 'white',
        borderColor: liwiColors.redColor,
        borderWidth: 1,
        borderRadius: 32,
        width: 55,
        height: 55,
      }}
    >
      <Icon
        name="close"
        type="AntDesign"
        style={{
          fontSize: 25,
          color: liwiColors.redColor,
        }}
      />
    </Button>
  );
}
