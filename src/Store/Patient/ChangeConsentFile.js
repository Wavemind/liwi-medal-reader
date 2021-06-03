import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('patient/changeConsentFile'),
  reducers(state, { payload }) {
    state.item.consent_file = payload.consentFile
  },
}
