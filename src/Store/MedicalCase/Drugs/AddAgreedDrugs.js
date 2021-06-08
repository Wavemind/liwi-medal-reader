import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/addAgreedDrugs'),
  reducers(state, { payload }) {
    state.item.diagnosis[payload.diagnosisType][payload.diagnosisId].drugs.agreed = {
      ...state.item.diagnosis[payload.diagnosisType][payload.diagnosisId].drugs.agreed,
      [payload.drugId]: payload.drugContent,
    }
  },
}
