import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/removeCustomDrugs'),
  reducers(state, { payload }) {
    delete state.item.diagnosis.custom[payload.diagnosisId].drugs[payload.drugId]
  },
}
