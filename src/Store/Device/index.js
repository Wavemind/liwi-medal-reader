import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import Register from './Register'
import Destroy from './Destroy'

const sliceInitialState = {
  item: {},
}

export default buildSlice('device', [Register, Destroy], sliceInitialState)
  .reducer
