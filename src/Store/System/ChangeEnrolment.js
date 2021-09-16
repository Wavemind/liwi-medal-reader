import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('system/changeEnrolment'),
  reducers(state, { payload }) {
    state.enrolment = payload.newEnrolment
  },
}
