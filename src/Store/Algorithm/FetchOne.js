/**
 * The external imports
 */
import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

/**
 * The internal imports
 */
import fetchOneAlgorithmService from '@/Services/Algorithm/FetchOne'
import { navigate } from '@/Navigators/Root'

export default {
  initialState: buildAsyncState('fetchOne'),
  action: buildAsyncActions(
    'algorithm/fetchOne',
    async (args, { dispatch }) => {
      const algorithm = await fetchOneAlgorithmService(args)

      navigate('InfoModal', { type: 'algorithm', algorithm })
      return algorithm
    },
  ),
  reducers: buildAsyncReducers({
    errorKey: 'fetchOne.error',
    loadingKey: 'fetchOne.loading',
  }),
}
