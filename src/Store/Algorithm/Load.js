import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('algorithm/load'),
  reducers(state, { payload }) {
    state.item = payload.newAlgorithm
  },
}
