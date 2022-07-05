import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('validation/reset'),
  reducers(state) {
    state.item = {}
  },
}
