import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('algorithm/changeEmergencyContent'),
  reducers(state, { payload }) {
    state.content = payload.newContent
  },
}
