import {
  buildAsyncState,
  buildAsyncActions,
  buildAsyncReducers,
} from '@thecodingmachine/redux-toolkit-wrapper'

import { store } from '@/Store'
import useDatabase from '@/Services/Database/Database'

export default {
  initialState: buildAsyncState(),
  action: buildAsyncActions('startup/init', async (args, { dispatch }) => {
    const state = store.getState()
    const { createPatient } = useDatabase()
    await createPatient(state.patient.item, state.medicalCase.item)
  }),
  reducers: buildAsyncReducers({ itemKey: null }), // We do not want to modify some item by default
}
