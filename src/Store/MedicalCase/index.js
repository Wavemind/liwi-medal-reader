import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import create from './create'

const sliceInitialState = {
  item: {},
}

export default buildSlice('scan', [create], sliceInitialState).reducer
