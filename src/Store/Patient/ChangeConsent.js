import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('patient/changeConsent'),
  reducers(state, { payload }) {
    state.item.consent = payload.value
  },
}
