import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('filters/changeFilters'),
  reducers(state, { payload: { source, item } }) {
    // GL HF bitches (reviewers) <3
    if (item.nodeId in state[source]) {
      const answerIndex = state[source][item.nodeId].indexOf(item.answerId)
      if (answerIndex > -1) {
        // Remove answer
        state[source][item.nodeId].splice(answerIndex, 1)
        if (state[source][item.nodeId].length === 0) {
          // Remove node id if contains no more answer id
          delete state[source][item.nodeId]
        }
      } else {
        // Node id exist but answer not in
        state[source][item.nodeId].push(item.answerId)
      }
    } else {
      // Node id doesn't exist
      state[source][item.nodeId] = []
      state[source][item.nodeId].push(item.answerId)
    }
  },
}
