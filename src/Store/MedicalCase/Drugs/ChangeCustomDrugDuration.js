import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/changeCustomDrugDuration'),
  reducers(state, { payload }) {
    state.item.diagnosis.custom[payload.diagnosisId].drugs[payload.drugId].duration = payload.duration
  },
}
5
