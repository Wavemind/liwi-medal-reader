import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('filters/changeFilters'),
  reducers(state, { payload: { list, item } }) {
    // TODO GL HF for reviewers <3 
    if (item.nodeId in state[list]) {
      const answerIndex = state[list][item.nodeId].indexOf(item.answerId)
      if (answerIndex > -1) {
        // Remove answer
        state[list][item.nodeId].splice(answerIndex, 1)
        if (state[list][item.nodeId].length === 0) {
          // Remove node id if contains no more answer id
          delete state[list][item.nodeId]
        }
      } else {
        // Node id exist but answer not in
        state[list][item.nodeId].push(item.answerId)
      }
    } else {
      // Node id doesn't exist
      state[list][item.nodeId] = []
      state[list][item.nodeId].push(item.answerId)
    }
  },
}
