import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('loader/toggleOverlayLoader'),
  reducers(state) {
    state.overlayLoader = !state.overlayLoader
  },
}
