import {
  buildAsyncState,
  buildAsyncActions,
  buildAsyncReducers,
} from '@thecodingmachine/redux-toolkit-wrapper'

import { navigateAndSimpleReset } from '@/Navigators/Root'
import DefaultTheme from '@/Store/Theme/DefaultTheme'

export default {
  initialState: buildAsyncState(),
  action: buildAsyncActions('startup/init', async (args, { dispatch }) => {
    // Timeout to fake waiting some process
    // Remove it, or keep it if you want display a beautiful splash screen ;)
    await new Promise(resolve => setTimeout(resolve, 100))

    // Set default theme
    await dispatch(DefaultTheme.action({ theme: 'default', darkMode: null }))

    // Navigate and reset to the main navigator
    navigateAndSimpleReset('Main')
  }),
  reducers: buildAsyncReducers({ itemKey: null }), // We do not want to modify some item by default
}
