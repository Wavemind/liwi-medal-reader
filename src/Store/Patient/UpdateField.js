import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('patient/updateField'),
  reducers(state, { payload }) {
    const { field, value } = payload
    state.item[field] = value
  },
}
