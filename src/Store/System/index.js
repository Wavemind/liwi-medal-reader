import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import Auth from './Auth'
import InitializeVersion from './InitializeVersion'

const sliceInitialState = {
  item: {},
}

export default buildSlice('system', [Auth, InitializeVersion], sliceInitialState).reducer
