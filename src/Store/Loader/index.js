import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import ToggleOverlayLoader from './ToggleOverlayLoader'

const sliceInitialState = {
  overlayLoader: false,
}

export default buildSlice('system', [ToggleOverlayLoader], sliceInitialState)
  .reducer
