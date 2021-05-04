import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import FetchOne from './FetchOne'
import ChangeClinician from './ChangeClinician'

const sliceInitialState = {
  item: {},
  clinician: {},
}

export default buildSlice(
  'healthFacility',
  [FetchOne, ChangeClinician],
  sliceInitialState,
).reducer
