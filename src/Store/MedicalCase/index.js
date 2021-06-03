import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import Create from './Create'

const sliceInitialState = {
  item: {},
}

export default buildSlice('scan', [Create], sliceInitialState).reducer
