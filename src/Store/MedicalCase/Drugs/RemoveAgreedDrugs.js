import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/removeAgreedDrugs'),
  reducers(state, { payload }) {
    const prevState = {
      ...state.item.diagnosis[payload.type][payload.diagnosisId].drugs.agreed,
    }
    delete prevState[payload.drugId]
    state.item.diagnosis[payload.type][payload.diagnosisId].drugs.agreed = prevState
  },
}
