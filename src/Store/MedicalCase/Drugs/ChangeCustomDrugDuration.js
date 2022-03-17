import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/changeCustomDrugDuration'),
  reducers(state, { payload }) {
    if (payload.diagnosisKey === 'custom') {
      state.item.diagnosis[payload.diagnosisKey][payload.diagnosisId].drugs[
        payload.drugId
      ].duration = payload.duration
    } else {
      state.item.diagnosis[payload.diagnosisKey][
        payload.diagnosisId
      ].drugs.custom[payload.drugId].duration = payload.duration
    }
  },
}
5
