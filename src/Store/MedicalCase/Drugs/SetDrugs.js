import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import SetDrugs from '@/Services/MedicalCase/SetDrugs'

export default {
  initialState: buildAsyncState('setDrugs'),
  action: buildAsyncActions('medicalCase/setDrugs', SetDrugs),
  reducers: buildAsyncReducers({
    errorKey: 'setDrugs.error',
    loadingKey: 'setDrugs.loading',
  }),
}
