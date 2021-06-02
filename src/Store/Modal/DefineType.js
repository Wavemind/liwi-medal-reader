import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('modal/defineType'),
  reducers(state, { payload }) {
    state.type = payload.type
  },
}
