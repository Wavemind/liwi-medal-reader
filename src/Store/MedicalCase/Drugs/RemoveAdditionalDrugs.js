import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/removeAdditionalDrugs'),
  reducers(state, { payload }) {
    delete state.item.diagnosis[payload.diagnosisKey][payload.diagnosisId].drugs
      .additional[payload.drugId]
  },
}
