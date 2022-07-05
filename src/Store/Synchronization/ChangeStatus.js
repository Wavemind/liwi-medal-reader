import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('synchronization/changeStatus'),
  reducers(state, { payload }) {
    state.status = payload.newSatus
  },
}
