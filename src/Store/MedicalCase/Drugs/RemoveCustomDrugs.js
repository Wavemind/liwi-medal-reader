import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/removeCustomDrugs'),
  reducers(state, { payload }) {
    delete state.item.diagnosis[payload.diagnosisKey][payload.diagnosisId].drugs
      .custom[payload.drugId]
  },
}
