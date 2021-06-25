import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/updateNodeFields'),
  reducers(state, { payload }) {
    payload.toUpdate.forEach(node => {
      const { nodeId, field, value } = node
      state.item.nodes[nodeId][field] = value
    })
  },
}
