import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('medicalCase/importPatientValues'),
  reducers(state, { payload }) {
    payload.toUpdate.forEach(node => {
      const { nodeId, field, value } = node
      if (payload.currentNodes[nodeId].is_pre_fill) {
        state.item.nodes[nodeId][field] = value
      }
    })
  },
}
