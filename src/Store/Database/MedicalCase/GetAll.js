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
    medicalCase: {
      getAll: {
        item: { data: [], isLastBatch: false },
        loading: false,
        error: null,
      },
    },
  },
  action: buildAsyncActions(
    'database/medicalCase/getAll',
    getAllMedicalCaseService,
  ),
  reducers: buildAsyncReducers({
    itemKey: 'medicalCase.getAll.item',
    errorKey: 'medicalCase.getAll.error',
    loadingKey: 'medicalCase.getAll.loading',
  }),
}
