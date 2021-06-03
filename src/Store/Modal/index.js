import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import ToggleVisibility from './ToggleVisibility'
import DefineType from './DefineType'

const sliceInitialState = {
  visible: false,
  type: null,
}

export default buildSlice(
  'modal',
  [ToggleVisibility, DefineType],
  sliceInitialState,
).reducer
