import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/removeAdditionalDiagnoses'),
  reducers(state, { payload }) {
    delete state.item.diagnosis.additional[payload.diagnosisId]
  },
}
