const detox = require('detox');
const config = require('../package.json').detox;

describe('liwi Native Detox test', () => {
  beforeEach(async () => {
    if (typeof device == 'undefined') {
      await detox.init(config);
    }
    await device.reloadReactNative({ delete: true, permissions: { location: 'always' } });
  });

  it('should create new session on tablet, login and go to home', async () => {
    await expect(element(by.id('UnLockSession'))).toBeVisible();

    await element(by.id('new_session')).tap();
    await waitFor(element(by.id('new_session')).atIndex(1))
      .toBeVisible()
      .withTimeout(8000);

    await element(by.id('connect_main')).tap();
    await waitFor(element(by.id('SetCodeSession')).atIndex(1))
      .toBeVisible()
      .withTimeout(8000);

    await element(by.id('set_code')).tap();

    await waitFor(element(by.id('HomeScreen')).atIndex(1))
      .toBeVisible()
      .withTimeout(8000);

    await element(by.id('GoToPatientUpsert')).tap();

    await waitFor(element(by.id('PatientUpsertScreen')).atIndex(1))
      .toBeVisible()
      .withTimeout(8000);
  });
});
