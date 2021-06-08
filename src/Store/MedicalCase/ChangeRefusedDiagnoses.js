import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/changeRefusedDiagnoses'),
  reducers(state, { payload }) {
    state.item.diagnosis.refused = payload.newRefusedDiagnoses
  },
}
