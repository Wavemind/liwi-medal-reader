import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('healthFacility/destroy'),
  reducers(state) {
    state.item = {}
    state.clinician = {}
  },
}
