import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/updateActivities'),
  reducers(state, { payload }) {
    state.item.activities.push(payload.stageActivities)
  },
}
