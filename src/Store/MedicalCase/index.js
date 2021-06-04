import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import Create from './Create'
import SetAnswer from './SetAnswer'
import ChangeAdvancement from './ChangeAdvancement'

const sliceInitialState = {
  item: {},
}

export default buildSlice(
  'scan',
  [Create, ChangeAdvancement, SetAnswer],
  sliceInitialState,
).reducer
