import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/addCustomDiagnoses'),
  reducers(state, { payload }) {
    state.item.diagnosis.custom = {
      ...state.item.diagnosis.custom,
      [payload.diagnosisId]: payload.diagnosisContent,
    }
  },
}
