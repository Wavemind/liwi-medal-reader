import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/changeAgreedDiagnoses'),
  reducers(state, { payload }) {
    state.item.diagnosis.agreed = payload.newAgreedDiagnoses
  },
}
