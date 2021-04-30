import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import NewSession from './NewSession'

const sliceInitialState = {
  item: {},
}

export default buildSlice('user', [NewSession], sliceInitialState).reducer
