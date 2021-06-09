import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/changeAdditionalDrugDuration'),
  reducers(state, { payload }) {
    state.item.diagnosis[payload.diagnosisType][payload.diagnosisId].drugs.additional[payload.drugId] =
      payload.newAdditionalDrug
  },
}
