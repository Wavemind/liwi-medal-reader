import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/changeAdditionalDiagnosis'),
  reducers(state, { payload }) {
    state.item.diagnosis.additional = payload.newAdditionalDiagnosis
  },
}
