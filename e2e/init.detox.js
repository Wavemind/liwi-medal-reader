const detox = require('detox');
const config = require('../package.json').detox;
const adapter = require('detox/runners/jest/adapter');
const specReporter = require('detox/runners/jest/specReporter');

// Set the default timeout
jest.setTimeout(120000);
jasmine.getEnv().addReporter(adapter);

// This takes care of generating status logs on a per-spec basis. By default, jest only reports at file-level.
// This is strictly optional.
jasmine.getEnv().addReporter(specReporter);

beforeAll(async () => {
  await detox.init(config, { launchApp: false });
});

beforeEach(async () => {
  await adapter.beforeEach();
});

afterAll(async () => {
  await adapter.afterAll();
  await detox.cleanup();
});

export const loadApp = () =>
  it('should load app and accept permissions', async () => {
    await device.launchApp({ permissions: { location: 'always' } });
    await expect(element(by.id('UnLockSession'))).toBeVisible();
  });

export const logIn = () =>
  it('should log in to main server', async () => {
    await element(by.id('new_session')).tap();
    await waitFor(element(by.id('new_session')).atIndex(1))
      .toBeVisible()
      .withTimeout(8000);

    await element(by.id('connect_main')).tap();
  });

export const setCodeSession = () =>
  it('should load app and accept permissions', async () => {
    await waitFor(element(by.id('SetCodeSession')).atIndex(1))
      .toBeVisible()
      .withTimeout(8000);

    await element(by.id('set_code')).tap();
  });

export const showHomeScreen = () =>
  it('should show Home screen', async () => {
    await waitFor(element(by.id('HomeScreen')).atIndex(1))
      .toBeVisible()
      .withTimeout(8000);
  });

export const createPatient = () =>
  it('Should go to Patient Screen', async () => {
    await element(by.id('GoToPatientUpsert')).tap();

    await waitFor(element(by.id('PatientUpsertScreen')).atIndex(1))
      .toBeVisible()
      .withTimeout(8000);
  });
