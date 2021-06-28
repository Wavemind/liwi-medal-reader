import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/updateComment'),
  reducers(state, { payload }) {
    const { value } = payload
    state.item.comment = value
  },
}
