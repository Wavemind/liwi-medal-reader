import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('validation/reset'),
  reducers(state, { payload }) {
    console.log('ici')
    state.item = {}
  },
}
