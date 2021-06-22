import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/destroy'),
  reducers(state, { payload }) {
    state.item = {}
  },
}
