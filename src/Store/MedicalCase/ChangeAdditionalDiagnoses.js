import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/changeAdditionalDiagnoses'),
  reducers(state, { payload }) {
    state.item.diagnosis.additional = payload.newAdditionalDiagnoses
  },
}