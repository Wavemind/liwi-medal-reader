import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/removeCustomDiagnoses'),
  reducers(state, { payload }) {
    delete state.item.diagnosis.custom[payload.diagnosisId]
  },
}
