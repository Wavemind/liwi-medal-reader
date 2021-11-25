import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import ChangeValue from './ChangeValue'
import NewSession from './NewSession'

const sliceInitialState = {
  item: false,
  medAlDataURL: null,
}

export default buildSlice('auth', [ChangeValue, NewSession], sliceInitialState)
  .reducer
