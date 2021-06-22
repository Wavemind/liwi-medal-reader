import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import ActivityInsert from './Insert'

const sliceInitialState = {
  insert: {},
}

export default buildSlice(
  'databaseActivity',
  [ActivityInsert],
  sliceInitialState,
).reducer
