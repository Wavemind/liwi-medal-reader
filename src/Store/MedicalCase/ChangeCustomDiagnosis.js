import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/changeCustomDiagnosis'),
  reducers(state, { payload }) {
    state.item.diagnosis.custom = payload.newCustomDiagnosis
  },
}
