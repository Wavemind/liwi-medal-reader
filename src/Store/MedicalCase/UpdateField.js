import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/updateField'),
  reducers(state, { payload }) {
    const { field, value } = payload
    state.item[field] = value
  },
}
