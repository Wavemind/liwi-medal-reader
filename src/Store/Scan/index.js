import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import HandleQr from './HandleQr'

const sliceInitialState = {
  item: {},
}

export default buildSlice('scan', [HandleQr], sliceInitialState).reducer
