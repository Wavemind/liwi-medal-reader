import React from 'react';
import { createStackNavigator, createDrawerNavigator } from 'react-navigation';

import Drawer from './drawer/Drawer.navigation';
import MainScreen from '../../screens/main/Main.screen';

const Stack = createStackNavigator({
  Home: {
    screen: MainScreen,
    navigationOptions: ({ navigation }) => {
      return {
        title: 'Main page',
      };
    },
  },
});

export default createDrawerNavigator(
  {
    Home: { screen: Stack },
  },
  {
    contentComponent: (props) => <Drawer {...props} />,
  }
);
