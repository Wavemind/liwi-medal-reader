import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import ChangeEmergencyContent from './ChangeEmergencyContent'
import FetchOne from './FetchOne'

const sliceInitialState = {
  content: '',
  json_version: -1,
  item: {},
}

export default buildSlice(
  'emergency',
  [ChangeEmergencyContent, FetchOne],
  sliceInitialState,
).reducer
