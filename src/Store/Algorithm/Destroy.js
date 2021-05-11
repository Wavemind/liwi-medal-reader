import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('algorithm/destroy'),
  reducers(state) {
    state.item = {}
  },
}
