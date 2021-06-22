import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import Insert from './Insert'
import Update from './Update'

const sliceInitialState = {
  insert: {},
  update: {},
}

export default buildSlice(
  'databasePatientValues',
  [Insert, Update],
  sliceInitialState,
).reducer
