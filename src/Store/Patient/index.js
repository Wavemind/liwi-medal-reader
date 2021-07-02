import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import Create from './Create'
import UpdateField from './UpdateField'
import Load from './Load'
import Destroy from './Destroy'

const sliceInitialState = {
  item: {},
  savedInDatabase: false,
}

export default buildSlice(
  'patient',
  [Create, Destroy, Load, UpdateField],
  sliceInitialState,
).reducer
