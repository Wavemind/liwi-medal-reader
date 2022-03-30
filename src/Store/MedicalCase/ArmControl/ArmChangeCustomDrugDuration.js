import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/armChangeCustomDrugDuration'),
  reducers(state, { payload }) {
    state.item.diagnosis.additional[payload.diagnosisId].drugs.custom[
      payload.drugId
    ].duration = payload.duration
  },
}
