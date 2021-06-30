import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('filters/clearFilters'),
  reducers(state, { payload: { source } }) {
    state[source] = {}
  },
}
