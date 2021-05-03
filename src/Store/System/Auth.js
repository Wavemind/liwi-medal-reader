import { isFulfilled } from '@reduxjs/toolkit'
import {
  buildAsyncState,
  buildAsyncActions,
  buildAsyncReducers,
} from '@thecodingmachine/redux-toolkit-wrapper'

import { navigateAndSimpleReset } from '@/Navigators/Root'

import DeviceRegister from '@/Store/Device/Register'
import NewSessionUser from '@/Store/User/NewSession'

export default {
  initialState: buildAsyncState('auth'),
  action: buildAsyncActions('system/auth', async (args, { dispatch }) => {
    // Auth user
    const newSessionUser = await dispatch(NewSessionUser.action({ ...args }))

    if (isFulfilled(newSessionUser)) {
      // Register device in medAl-creator
      const deviceRegister = await dispatch(DeviceRegister.action({}))

      if (isFulfilled(deviceRegister)) {
        // Navigate and reset to Synchronization container
        navigateAndSimpleReset('Synchronization')
      }
    }
  }),
  reducers: buildAsyncReducers({
    itemKey: null,
    errorKey: 'auth.error',
    loadingKey: 'auth.loading',
  }),
}
