import { isFulfilled } from '@reduxjs/toolkit'
import {
  buildAsyncState,
  buildAsyncActions,
  buildAsyncReducers,
} from '@thecodingmachine/redux-toolkit-wrapper'

import { navigateAndSimpleReset } from '@/Navigators/Root'

import FetchOneHealthFacility from '@/Store/HealthFacility/FetchOne'
import FetchOneAlgorithm from '@/Store/Algorithm/FetchOne'

export default {
  initialState: buildAsyncState('initializeVersion'),
  action: buildAsyncActions(
    'system/InitializeVersion',
    async (args, { dispatch }) => {
      // Get health facility info
      const fetchOneHealthFacility = await dispatch(
        FetchOneHealthFacility.action({}),
      )

      if (isFulfilled(fetchOneHealthFacility)) {
        // Register device in medAl-creator
        const fetchOneAlgorithm = await dispatch(FetchOneAlgorithm.action({}))

        if (isFulfilled(fetchOneAlgorithm)) {
          // Navigate and reset to the main navigator
          navigateAndSimpleReset('Pin')
        }
      }
    },
  ),
  reducers: buildAsyncReducers({
    itemKey: null,
    errorKey: 'initializeVersion.error',
    loadingKey: 'initializeVersion.loading',
  }),
}
