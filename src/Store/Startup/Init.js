/**
 * The external imports
 */
import {
  buildAsyncState,
  buildAsyncActions,
  buildAsyncReducers,
} from '@thecodingmachine/redux-toolkit-wrapper'
import { DocumentDirectoryPath, exists, readFile } from 'react-native-fs'
import * as Sentry from '@sentry/react-native'

/**
 * The internal imports
 */
import i18n from '@/Translations'
import DefaultTheme from '@/Store/Theme/DefaultTheme'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import { store } from '@/Store'
import { RedirectService } from '@/Services/Device'
import FetchOneHealthFacility from '@/Store/HealthFacility/FetchOne'

export default {
  initialState: buildAsyncState(),
  action: buildAsyncActions('startup/init', async (_args, { dispatch }) => {
    const state = store.getState()

    // Set default language
    const appLanguage = state.healthFacility.clinician.app_language
    i18n.changeLanguage(appLanguage)

    // Set default theme
    await dispatch(DefaultTheme.action({ theme: 'default', darkMode: null }))

    // Set algorithm
    const algorithmTargetPath = `${DocumentDirectoryPath}/version_${state.system.versionId}.json`
    const algorithmFileExist = await exists(algorithmTargetPath)

    if (algorithmFileExist) {
      const algorithm = await readFile(algorithmTargetPath)
      await dispatch(
        LoadAlgorithm.action({
          newAlgorithm: JSON.parse(algorithm),
        }),
      )

      Sentry.setContext('algorithm', {
        algorithm_id: algorithm.id,
        algorithm_name: algorithm.algorithm_name,
        version_id: algorithm.version_id,
        version_name: algorithm.version_name,
        study_id: algorithm.study.id,
        study_name: algorithm.study.label,
        is_arm_control: algorithm.is_arm_control,
      })
    }

    // Get health facility update
    if (state.healthFacility.item.id) {
      console.log(state.healthFacility)
      Sentry.setContext('heath faciliity', {
        ...state.healthFacility.item,
      })
      await dispatch(FetchOneHealthFacility.action({}))
    }

    RedirectService()
  }),
  reducers: buildAsyncReducers({ itemKey: null }), // We do not want to modify some item by default
}
