import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import Register from './Register'

const sliceInitialState = {
  item: {},
}

export default buildSlice('device', [Register], sliceInitialState).reducer
