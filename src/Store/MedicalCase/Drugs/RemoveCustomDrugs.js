import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/removeCustomDrugs'),
  reducers(state, { payload }) {
    if (payload.diagnosisKey === 'custom') {
      delete state.item.diagnosis[payload.diagnosisKey][payload.diagnosisId]
        .drugs[payload.drugId]
    } else {
      delete state.item.diagnosis[payload.diagnosisKey][payload.diagnosisId]
        .drugs.custom[payload.drugId]
    }
  },
}
