import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/removeRefusedDrug'),
  reducers(state, { payload }) {
    state.item.diagnosis[payload.type][payload.diagnosisId].drugs.refused =
      payload.newRefusedDrugs
  },
}
