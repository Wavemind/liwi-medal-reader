import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/addCustomDrugs'),
  reducers(state, { payload }) {
    if (payload.diagnosisKey === 'custom') {
      state.item.diagnosis[payload.diagnosisKey][payload.diagnosisId].drugs = {
        ...state.item.diagnosis[payload.diagnosisKey][payload.diagnosisId]
          .drugs,
        [payload.drugId]: payload.drugContent,
      }
    } else {
      state.item.diagnosis[payload.diagnosisKey][
        payload.diagnosisId
      ].drugs.custom = {
        ...state.item.diagnosis[payload.diagnosisKey][payload.diagnosisId].drugs
          .custom,
        [payload.drugId]: payload.drugContent,
      }
    }
  },
}
