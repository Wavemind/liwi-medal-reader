import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/addRefusedDrugs'),
  reducers(state, { payload }) {
    state.item.diagnosis[payload.diagnosisType][payload.diagnosisId].drugs.refused =
      payload.newRefusedDrugs
  },
}
