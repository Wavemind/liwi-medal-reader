import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/armAddCustomDrugs'),
  reducers(state, { payload }) {
    state.item.diagnosis.additional[payload.diagnosisId].drugs.custom = {
      ...state.item.diagnosis.additional[payload.diagnosisId].drugs.custom,
      [payload.drugId]: payload.drugContent,
    }
  },
}
