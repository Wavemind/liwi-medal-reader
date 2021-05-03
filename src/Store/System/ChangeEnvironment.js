import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('system/changeEnvironment'),
  reducers(state, { payload }) {
    state.environment = payload.newEnvironment
  },
}
