import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('modal/toggleVisibility'),
  reducers(state, {}) {
    state.visible = !state.visible
    if (!state.visible) {
      state.type = null
      state.params = null
    }
  },
}
