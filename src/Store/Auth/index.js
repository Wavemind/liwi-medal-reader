import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import ChangeValue from './ChangeValue'
import NewSession from './NewSession'
import Destroy from './Destroy'

const sliceInitialState = {
  item: false,
  medAlDataURL: null,
}

export default buildSlice(
  'auth',
  [ChangeValue, NewSession, Destroy],
  sliceInitialState,
).reducer
