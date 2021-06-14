import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/changeFormulations'),
  reducers(state, { payload }) {
    state.item.diagnosis[payload.diagnosisKey][payload.diagnosisId].drugs[payload.drugKey] = {
      ...state.item.diagnosis[payload.diagnosisKey][payload.diagnosisId].drugs[payload.drugKey],
      [payload.drugId]: {
        ...state.item.diagnosis[payload.diagnosisKey][payload.diagnosisId].drugs[payload.drugKey][payload.drugId],
        formulation_id: payload.formulationId,
      },
    }
  },
}
