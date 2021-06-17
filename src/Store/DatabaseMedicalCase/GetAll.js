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
import getAllMedicalCaseService from '@/Services/MedicalCase/GetAll'

export default {
  initialState: {
    getAll: {
      item: { data: [], isLastBatch: false },
      loading: false,
      error: null,
    },
  },
  action: buildAsyncActions(
    'databaseMedicalCase/getAll',
    getAllMedicalCaseService,
  ),
  reducers: buildAsyncReducers({
    itemKey: 'getAll.item',
    errorKey: 'getAll.error',
    loadingKey: 'getAll.loading',
  }),
}
