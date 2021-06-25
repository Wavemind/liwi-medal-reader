/**
 * The external imports
 */
import {
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

/**
 * The internal imports
 */
import getAll from '@/Services/Patient/GetAll'

export default {
  initialState: {
    getAll: {
      item: { data: [], isLastBatch: false },
      loading: false,
      error: null,
    },
  },
  action: buildAsyncActions('databasePatient/getAll', getAll),
  reducers: buildAsyncReducers({
    itemKey: 'getAll.item',
    errorKey: 'getAll.error',
    loadingKey: 'getAll.loading',
  }),
}
