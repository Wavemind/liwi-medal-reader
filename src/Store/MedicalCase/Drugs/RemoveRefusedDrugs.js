import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/removeRefusedDrug'),
  reducers(state, { payload }) {
    const refusedDrugs = state.item.diagnosis[payload.diagnosisKey][payload.diagnosisId].drugs.refused
    refusedDrugs.splice(refusedDrugs.indexOf(payload.drugId), 1)
  },
}
