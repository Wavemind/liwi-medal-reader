import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/clearActivities'),
  reducers(state, { payload }) {
    state.item.activities = []
  },
}
