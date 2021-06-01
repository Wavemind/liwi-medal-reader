import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('system/changeVersion'),
  reducers(state, { payload }) {
    state.versionId = payload.newVersionId
  },
}
