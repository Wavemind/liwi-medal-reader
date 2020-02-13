/* eslint-env detox/detox, mocha */

import { acceptPermissions, createPatient, loadApp, logIn, setCodeSession, showHomeScreen } from './init.detox';

const detox = require('detox');
const config = require('../package.json').detox;
const adapter = require('detox/runners/jest/adapter');

describe('liwi Native Detox test', () => {
  loadApp();
  acceptPermissions();
  logIn();
  setCodeSession();
  showHomeScreen();
  createPatient();
});
