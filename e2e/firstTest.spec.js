const detox = require('detox');
const config = require('../package.json').detox;

describe('liwi Native Work', () => {
  beforeEach(async () => {
    if (typeof device == 'undefined') {
      await detox.init(config);
    }
    await device.reloadReactNative();
  });

  it('should have welcome screen', async () => {
    await expect(element(by.id('welcome'))).toBeVisible();
    await element(by.id('new_session')).tap();
    await waitFor(element(by.id('new_session')).atIndex(1))
      .toBeVisible()
      .withTimeout(8000);

    await element(by.id('connect_main')).tap();
    await waitFor(element(by.id('welcome')).atIndex(1))
      .toBeVisible()
      .withTimeout(8000);

    await element(by.id('set_code')).tap();
    await waitFor(element(by.id('settings_view')).atIndex(1))
      .toBeVisible()
      .withTimeout(8000);

    await element(by.id('header-back')).tap();

    await waitFor(element(by.id('patient_list')).atIndex(1))
      .toBeVisible()
      .withTimeout(8000);
    await element(by.id('create_patient')).tap();
  });
});
