import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/removeAgreedDiagnoses'),
  reducers(state, { payload }) {
    delete state.item.diagnosis.agreed[payload.diagnosisId]
  },
}
