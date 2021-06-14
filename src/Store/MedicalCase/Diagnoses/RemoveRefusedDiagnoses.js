import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/removeRefusedDiagnoses'),
  reducers(state, { payload }) {
    const refusedDiagnoses = state.item.diagnosis.refused
    refusedDiagnoses.splice(refusedDiagnoses.indexOf(payload.diagnosisId), 1)
  },
}
