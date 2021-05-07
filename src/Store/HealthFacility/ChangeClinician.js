import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('healthFacility/changeClinician'),
  reducers(state, { payload }) {
    state.clinician = payload.clinician
  },
}
