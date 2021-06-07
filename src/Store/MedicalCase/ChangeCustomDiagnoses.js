import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/changeCustomDiagnoses'),
  reducers(state, { payload }) {
    state.item.diagnosis.custom = payload.newCustomDiagnoses
  },
}
