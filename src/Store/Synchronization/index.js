import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import Synchronize from './Synchronize'
import ChangeStatus from './ChangeStatus'

const sliceInitialState = {
  item: {},
  status: null,
}

export default buildSlice(
  'synchronization',
  [Synchronize, ChangeStatus],
  sliceInitialState,
).reducer
