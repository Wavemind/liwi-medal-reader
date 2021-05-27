import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import ChangeEmergencyContent from './ChangeEmergencyContent'

const sliceInitialState = {
  content: '',
}

export default buildSlice(
  'algorithm',
  [ChangeEmergencyContent],
  sliceInitialState,
).reducer
