export const jestNavigationProps = {
  state: { routeName: 'Home', key: 'id-1562837400930-1' },
  actions: {},
};

export const jestApplicationContextProps = {
  name: 'App',
  lang: 'fr',
  logged: true,
  user: {
    data: {
      deactivated: false,
      id: 3,
      email: 'mickael.lacombe@wavemind.ch',
      provider: 'email',
      role_id: 1,
      first_name: 'Mickael',
      last_name: 'Lacombe',
      uid: 'mickael.lacombe@wavemind.ch',
    },
    access_token: 'F5Vip7huymox4Fh67yFYCA',
    client: 'DrJntOtQVkNhBR2_46EFsA',
    expiry: '1563970500',
    uid: 'mickael.lacombe@wavemind.ch',
    local_code: 'abc9b601505d31a95dfc3eccec0e9e899d71f316c11d660b14d2e56370eea7d5',
    active: true,
    active_since: '2019-07-11T11:08:31+02:00',
    lastLogin: 'Wed Jul 10 2019 12:17:37 GMT+0000',
  },
  isConnected: true,
  medicalCase: {},
  appState: 'active',
  contentModal: 'initial',
  initialPosition: {},
  t: () => {},
};

export const jestSessionsContextProps = {
  sessions: [
    {
      data: {
        deactivated: false,
        id: 3,
        email: 'mickael.lacombe@wavemind.ch',
        provider: 'email',
        role_id: 1,
        first_name: 'Mickael',
        last_name: 'Lacombe',
        uid: 'mickael.lacombe@wavemind.ch',
      },
      access_token: 'F5Vip7huymox4Fh67yFYCA',
      client: 'DrJntOtQVkNhBR2_46EFsA',
      expiry: '1563970500',
      uid: 'mickael.lacombe@wavemind.ch',
      local_code: 'abc9b601505d31a95dfc3eccec0e9e899d71f316c11d660b14d2e56370eea7d5',
      active: true,
      active_since: '2019-07-11T11:08:31+02:00',
      lastLogin: 'Wed Jul 10 2019 12:17:37 GMT+0000',
    },
    {
      data: {
        deactivated: false,
        id: 1,
        email: 'quentin.girard@wavemind.ch',
        provider: 'email',
        role_id: 1,
        first_name: 'Quentin',
        last_name: 'Girard',
        uid: 'quentin.girard@wavemind.ch',
      },
      access_token: 'S4mWfLpPRUVAxNgmW7DSjQ',
      client: 'T3lw1JQCIwoIpQtrrQZmKQ',
      expiry: '1563972139',
      uid: 'quentin.girard@wavemind.ch',
      local_code: 'abc9b601505d31a95dfc3eccec0e9e899d71f316c11d660b14d2e56370eea7d5',
      active: false,
      active_since: false,
      lastLogin: 'Wed Jul 10 2019 12:42:27 GMT+0000',
    },
  ],
};

export const jestWithAllProps = {
  sessions: jestSessionsContextProps,
  app: jestApplicationContextProps,
  navigation: jestNavigationProps,
};
