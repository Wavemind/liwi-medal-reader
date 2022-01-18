import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('auth/changeMedAlDataURL'),
  reducers(state, { payload }) {
    state[payload.key] = payload.value
  },
}
