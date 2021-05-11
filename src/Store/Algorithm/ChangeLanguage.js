import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('system/changeLanguage'),
  reducers(state, { payload }) {
    state.language = payload.newLanguage
  },
}