import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('system/toggleOverlayLoader'),
  reducers(state) {
    state.overlayLoader = !state.overlayLoader
  },
}
