import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/removeAgreedDrugs'),
  reducers(state, { payload }) {
    delete state.item.diagnosis[payload.diagnosisKey][payload.diagnosisId].drugs.agreed[payload.drugId]
  },
}
