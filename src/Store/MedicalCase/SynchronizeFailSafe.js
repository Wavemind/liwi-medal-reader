import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import { SynchronizeFailSafeMedicalCaseService } from '@/Services/MedicalCase'

export default {
  initialState: buildAsyncState('synchronizeFailSafe'),
  action: buildAsyncActions(
    'medicalCase/synchronizeFailSafe',
    SynchronizeFailSafeMedicalCaseService,
  ),
  reducers: buildAsyncReducers({
    errorKey: 'synchronizeFailSafe.error',
    loadingKey: 'synchronizeFailSafe.loading',
  }),
}
