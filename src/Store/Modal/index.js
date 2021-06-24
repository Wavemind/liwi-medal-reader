import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import ToggleVisibility from './ToggleVisibility'
import SetParams from './SetParams'

const sliceInitialState = {
  visible: false,
  type: null,
  params: null,
}

export default buildSlice(
  'modal',
  [ToggleVisibility, SetParams],
  sliceInitialState,
).reducer
