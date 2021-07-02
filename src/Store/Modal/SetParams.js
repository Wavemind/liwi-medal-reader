import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('modal/setParams'),
  reducers(state, { payload }) {
    state.type = payload.type
    state.params = payload.params
  },
}
