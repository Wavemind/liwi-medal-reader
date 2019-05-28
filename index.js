/** @format */

import 'core-js/fn/reflect/define-metadata';
import 'core-js/fn/reflect/delete-metadata';
import 'core-js/fn/reflect/get-metadata';
import 'core-js/fn/reflect/get-metadata-keys';
import 'core-js/fn/reflect/get-own-metadata';
import 'core-js/fn/reflect/get-own-metadata-keys';
import 'core-js/fn/reflect/has-metadata';
import 'core-js/fn/reflect/has-own-metadata';
import 'core-js/fn/reflect/metadata';
import 'es6-symbol/implement';
import { AppRegistry } from 'react-native';
import App from './src/index';
import { name as appName } from './app.json';

console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);
