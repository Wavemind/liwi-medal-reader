import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/addCustomDrugs'),
  reducers(state, { payload }) {
    state.item.diagnosis.custom[payload.diagnosisId].drugs = {
      ...state.item.diagnosis.custom[payload.diagnosisId].drugs,
      [payload.drugId]: payload.drugContent,
    }
  },
}
