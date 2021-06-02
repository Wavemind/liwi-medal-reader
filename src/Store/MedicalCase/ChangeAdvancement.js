import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/changeAdvancement'),
  reducers(state, { payload }) {
    state.item.advancement.stage = payload.newStage
    state.item.advancement.step = payload.newStep
  },
}
