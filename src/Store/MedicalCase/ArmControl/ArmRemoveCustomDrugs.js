import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/armRemoveCustomDrugs'),
  reducers(state, { payload }) {
    delete state.item.diagnosis.additional[payload.diagnosisId].drugs.custom[payload.drugId]
  },
}
