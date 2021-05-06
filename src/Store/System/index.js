import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import ChangeEnvironment from './ChangeEnvironment'

const sliceInitialState = {
  item: {},
  environment: __DEV__ ? 'staging' : 'production',
}

export default buildSlice('system', [ChangeEnvironment], sliceInitialState).reducer
