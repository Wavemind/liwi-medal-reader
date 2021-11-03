import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import ChangeEnvironment from './ChangeEnvironment'
import ChangeVersion from './ChangeVersion'

const sliceInitialState = {
  item: {},
  environment: __DEV__ ? 'staging' : 'production',
  versionId: null,
}

export default buildSlice(
  'system',
  [ChangeEnvironment, ChangeVersion],
  sliceInitialState,
).reducer
