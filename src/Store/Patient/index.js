import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import Create from './Create'
import UpdateField from './UpdateField'

const sliceInitialState = {
  item: {},
}

export default buildSlice('patient', [Create, UpdateField], sliceInitialState)
  .reducer
