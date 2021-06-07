import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/removeAgreedDrugs'),
  reducers(state, { payload }) {
    const prevState = {
      ...state.item.diagnosis.agreed[payload.diagnosisId].drugs,
    }
    delete prevState[payload.drugId]
    state.item.diagnosis.agreed[payload.diagnosisId].drugs.agreed = prevState
  },
}
