import { createAction } from '@reduxjs/toolkit'
import { store } from '@/Store'

export default {
  initialState: {},
  action: createAction('medicalCase/addAgreedDrugs'),
  reducers(state, { payload }) {
    state.item.diagnosis[payload.diagnosisKey][payload.diagnosisId].drugs.agreed = {
      ...state.item.diagnosis[payload.diagnosisKey][payload.diagnosisId].drugs.agreed,
      [payload.drugId]: { id: payload.drugId },
    }
  },
}
