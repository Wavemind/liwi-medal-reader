/** @format */

import 'react-native-gesture-handler';
import 'core-js';
import 'es6-symbol/implement';
import { AppRegistry } from 'react-native';
import { Client } from 'bugsnag-react-native';

import App from './src/index';
import { name as appName } from './app.json';
import './src/utils/JSExceptionHandler';
import './src/utils/NativeExceptionHandler';

/* Special import
 * This import is necessary for rewrite prototype function JS
 * */
// eslint-disable-next-line no-unused-vars
import Prototype from './src/utils/Prototype.native';

const bugsnag = new Client('ff8bb928f246270295b29d01f72bc641');

AppRegistry.registerComponent(appName, () => App);
