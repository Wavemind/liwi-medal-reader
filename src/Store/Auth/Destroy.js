import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('auth/destroy'),
  reducers(state) {
    state.item = false
    state.medAlDataURL = null
  },
}
