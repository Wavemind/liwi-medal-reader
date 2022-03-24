import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/addCustomDrugs'),
  reducers(state, { payload }) {
    state.item.diagnosis[payload.diagnosisKey][
      payload.diagnosisId
    ].drugs.custom = {
      ...state.item.diagnosis[payload.diagnosisKey][payload.diagnosisId].drugs
        .custom,
      [payload.drugId]: payload.drugContent,
    }
  },
}
