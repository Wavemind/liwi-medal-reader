import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import { SetDrugsService } from '@/Services/MedicalCase'

export default {
  initialState: buildAsyncState('setDrugs'),
  action: buildAsyncActions('medicalCase/setDrugs', SetDrugsService),
  reducers: buildAsyncReducers({
    errorKey: 'setDrugs.error',
    loadingKey: 'setDrugs.loading',
  }),
}
