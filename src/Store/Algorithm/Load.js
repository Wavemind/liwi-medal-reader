import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('algorithm/load'),
  reducers(state, { payload }) {
    const nodes = {
      ...payload.newAlgorithm.nodes,
      ...payload.newAlgorithm.final_diagnostics,
      ...payload.newAlgorithm.health_cares,
    }

    // Remove useless key
    delete payload.newAlgorithm.emergency_content
    delete payload.newAlgorithm.nodes
    delete payload.newAlgorithm.final_diagnostics
    delete payload.newAlgorithm.health_cares

    // Store algorithm
    const algorithm = {
      ...payload.newAlgorithm,
      updated: false,
      nodes: { ...nodes },
    }
    state.item = algorithm
  },
}
