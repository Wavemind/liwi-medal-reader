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
import GetAllMedicalCasesService from '@/Services/MedicalCase/GetAll'

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
    GetAllMedicalCasesService,
  ),
  reducers: buildAsyncReducers({
    itemKey: 'getAll.item',
    errorKey: 'getAll.error',
    loadingKey: 'getAll.loading',
  }),
}
