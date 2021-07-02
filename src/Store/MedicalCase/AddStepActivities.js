import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/addStepActivities'),
  reducers(state, { payload }) {
    state.item.activities.push(payload.stepActivities)
  },
}
