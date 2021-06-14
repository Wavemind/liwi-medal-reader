import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/addAgreedDiagnoses'),
  reducers(state, { payload }) {
    state.item.diagnosis.agreed = {
      ...state.item.diagnosis.agreed,
      [payload.diagnosisId]: payload.diagnosisContent,
    }
  },
}
