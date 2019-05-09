/** @format */

import 'reflect-metadata';
import 'es6-symbol/implement';
import { AppRegistry } from 'react-native';
import App from './src/index';
import { name as appName } from './app.json';

console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);
