import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import { navigateAndSimpleReset } from '@/Navigators/Root'
import newSessionUserService from '@/Services/User/NewSession'
import DeviceRegister from '@/Store/Device/Register'

export default {
  initialState: buildAsyncState('newSession'),
  action: buildAsyncActions('user/newSession', async (args, { dispatch }) => {
    // Auth user
    await newSessionUserService(args)

    // Register device in medAl-Creator
    await dispatch(DeviceRegister.action({}))

    // Navigate and reset to the main navigator
    navigateAndSimpleReset('Synchronization')
  }),
  reducers: buildAsyncReducers({
    errorKey: 'newSession.error',
    loadingKey: 'newSession.loading',
  }),
}
