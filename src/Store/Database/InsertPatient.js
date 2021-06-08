import {
  buildAsyncState,
  buildAsyncActions,
  buildAsyncReducers,
} from '@thecodingmachine/redux-toolkit-wrapper'

import { store } from '@/Store'
import useDatabase from '@/Services/Database/useDatabase'

export default {
  initialState: buildAsyncState(),
  action: buildAsyncActions(
    'database/insertPatient',
    async (args, { dispatch }) => {
      const state = store.getState()
      const { insertPatient } = useDatabase()
      await insertPatient(state.patient.item, state.medicalCase.item)
    },
  ),
  reducers: buildAsyncReducers({ itemKey: null }), // We do not want to modify some item by default
}
