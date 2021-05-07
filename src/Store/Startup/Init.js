import { PermissionsAndroid } from 'react-native'
import {
  buildAsyncState,
  buildAsyncActions,
  buildAsyncReducers,
} from '@thecodingmachine/redux-toolkit-wrapper'

import { navigateAndSimpleReset, navigateAndReset } from '@/Navigators/Root'
import DefaultTheme from '@/Store/Theme/DefaultTheme'
import { store } from '@/Store'

export default {
  initialState: buildAsyncState(),
  action: buildAsyncActions('startup/init', async (args, { dispatch }) => {
    // Timeout to fake waiting some process
    // Remove it, or keep it if you want display a beautiful splash screen ;)
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Set default theme
    await dispatch(DefaultTheme.action({ theme: 'default', darkMode: null }))

    // Check auth status
    const state = store.getState()
    const isAuthenticated = state.user.item.hasOwnProperty('id')
    const deviceRegistered = state.device.item.hasOwnProperty('id')
    const healthFacilityAssociated = state.healthFacility.item.hasOwnProperty(
      'id',
    )
    const clinicianChoosed = state.healthFacility.clinician.hasOwnProperty('id')
    let route = {}

    // Check whether the right permissions have been granted
    // If so, navigate to the main navigator and reset
    // If not, redirect to the access denied page
    try {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]).then(res => {
        if (Object.values(res).every(result => result === 'granted')) {
          if (!isAuthenticated || !deviceRegistered) {
            route = 'Auth'
          } else if (!healthFacilityAssociated) {
            route = 'Synchronization'
          } else if (!clinicianChoosed) {
            route = 'ClinicianSelection'
          } else {
            route = 'Pin'
          }

          navigateAndReset([{ name: 'Auth', params: { screen: route } }])
        } else if (
          Object.values(res).some(result => result === 'never_ask_again')
        ) {
          navigateAndSimpleReset('PermissionsRequired')
        }
      })
    } catch (err) {
      console.warn(err)
    }
  }),
  reducers: buildAsyncReducers({ itemKey: null }), // We do not want to modify some item by default
}
