import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import ChangeValue from './ChangeValue'
import NewSession from './NewSession'

const sliceInitialState = {
  item: {},
  medAlDataURL: null,
}

export default buildSlice('auth', [ChangeValue, NewSession], sliceInitialState)
  .reducer
