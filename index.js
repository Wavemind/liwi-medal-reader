/** @format */

import 'core-js';
import 'es6-symbol/implement';
import { AppRegistry } from 'react-native';
import App from './src/index';
import { name as appName } from './app.json';

/* Special import
 * This import is necessary for rewrite prototype function JS
 * */
// eslint-disable-next-line no-unused-vars
import Prototype from './src/utils/Prototype.native';


AppRegistry.registerComponent(appName, () => App);
