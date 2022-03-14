import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/changeAdditionalDrugDuration'),
  reducers(state, { payload }) {
    state.item.diagnosis[payload.diagnosisKey][
      payload.diagnosisId
    ].drugs.additional[payload.drugId].duration = payload.duration
  },
}
