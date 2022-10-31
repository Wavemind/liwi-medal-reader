import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import ChangeVersion from './ChangeVersion'
import ToggleOverlayLoader from './ToggleOverlayLoader'

const sliceInitialState = {
  item: {},
  versionId: null,
  overlayLoader: false,
}

export default buildSlice(
  'system',
  [ChangeVersion, ToggleOverlayLoader],
  sliceInitialState,
).reducer
