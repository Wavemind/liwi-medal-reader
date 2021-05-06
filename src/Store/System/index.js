import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import Auth from './Auth'
import InitializeVersion from './InitializeVersion'
import ChangeEnvironment from './ChangeEnvironment'

const sliceInitialState = {
  item: {},
  environment: __DEV__ ? 'staging' : 'production',
}

export default buildSlice(
  'system',
  [Auth, InitializeVersion, ChangeEnvironment],
  sliceInitialState,
).reducer
