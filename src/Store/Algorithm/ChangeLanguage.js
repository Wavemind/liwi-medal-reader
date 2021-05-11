import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('algorithm/changeLanguage'),
  reducers(state, { payload }) {
    state.language = payload.newLanguage
  },
}
