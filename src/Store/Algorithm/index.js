import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import FetchOne from './FetchOne'
import Destroy from './Destroy'
import Load from './Load'

const sliceInitialState = {
  item: {},
}

export default buildSlice(
  'algorithm',
  [FetchOne, Destroy, Load],
  sliceInitialState,
).reducer
