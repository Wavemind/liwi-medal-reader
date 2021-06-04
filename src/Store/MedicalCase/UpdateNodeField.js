import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/updateNodeField'),
  reducers(state, { payload }) {
    const { nodeId, field, value } = payload
    state.item.nodes[nodeId][field] = value
  },
}
