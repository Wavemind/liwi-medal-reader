import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/addRefusedDiagnoses'),
  reducers(state, { payload }) {
    state.item.diagnosis.refused.push(payload.diagnosisId)
  },
}
