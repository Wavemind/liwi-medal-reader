import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('device/destroy'),
  reducers(state) {
    state.item = {}
  },
}
