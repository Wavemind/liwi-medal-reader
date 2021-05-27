import { PermissionsAndroid } from 'react-native'
import {
  buildAsyncState,
  buildAsyncActions,
  buildAsyncReducers,
} from '@thecodingmachine/redux-toolkit-wrapper'
import { DocumentDirectoryPath, exists, readFile } from 'react-native-fs'
import i18n from '@/Translations'

import { navigateAndSimpleReset, navigateAndReset } from '@/Navigators/Root'
import DefaultTheme from '@/Store/Theme/DefaultTheme'
import ChangeEmergencyContent from '@/Store/Emergency/ChangeEmergencyContent'
import { store } from '@/Store'

export default {
  initialState: buildAsyncState(),
  action: buildAsyncActions('startup/init', async (args, { dispatch }) => {
    const state = store.getState()

    // Set default language
    const appLanguage = state.system.language
    i18n.changeLanguage(appLanguage)

    // Set default theme
    await dispatch(DefaultTheme.action({ theme: 'default', darkMode: null }))

    // Set emergency content
    const targetPath = `${DocumentDirectoryPath}/emergency_content.html`
    const fileExist = await exists(targetPath)
    if (fileExist) {
      const emergencyContent = await readFile(targetPath)
      await dispatch(
        ChangeEmergencyContent.action({
          newContent: emergencyContent,
        }),
      )
    }

    // Check auth status
    const isAuthenticated = state.user.item.hasOwnProperty('id')
    const deviceRegistered = state.device.item.hasOwnProperty('id')
    const healthFacilityAssociated =
      state.healthFacility.item.hasOwnProperty('id')
    const clinicianSelected =
      state.healthFacility.clinician.hasOwnProperty('id')
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
          } else if (!clinicianSelected) {
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
