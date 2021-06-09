import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/changeCustomDrugs'),
  reducers(state, { payload }) {
    state.item.diagnosis.custom[payload.diagnosisId].drugs =
      payload.newCustomDrugs
  },
}
