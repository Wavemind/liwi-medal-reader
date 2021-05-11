import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import NewSession from './NewSession'
import DestroySession from './DestroySession'

const sliceInitialState = {
  item: {},
}

export default buildSlice(
  'user',
  [NewSession, DestroySession],
  sliceInitialState,
).reducer
