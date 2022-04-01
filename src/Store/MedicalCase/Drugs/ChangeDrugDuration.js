import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/ChangeDrugDuration'),
  reducers(state, { payload }) {
    state.item.diagnosis[payload.diagnosisKey][payload.diagnosisId].drugs[
      payload.drugKey
    ][payload.drugId].duration = payload.duration
  },
}
