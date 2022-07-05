import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('patient/destroy'),
  reducers(state) {
    state.item = {}
  },
}
