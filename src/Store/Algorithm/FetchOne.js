import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import { navigateAndSimpleReset } from '@/Navigators/Root'
import fetchOneAlgorithmService from '@/Services/Algorithm/FetchOne'

export default {
  initialState: buildAsyncState('fetchOne'),
  action: buildAsyncActions(
    'algorithm/fetchOne',
    async (args, { dispatch }) => {
      // Fetch algorithm
      await fetchOneAlgorithmService(args)
    },
  ),
  reducers: buildAsyncReducers({
    errorKey: 'fetchOne.error',
    loadingKey: 'fetchOne.loading',
  }),
}
