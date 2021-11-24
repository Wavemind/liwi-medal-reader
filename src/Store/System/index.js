import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import ChangeEnvironment from './ChangeEnvironment'
import ChangeVersion from './ChangeVersion'
import ChangeEnrolment from './ChangeEnrolment'

const sliceInitialState = {
  item: {},
  environment: __DEV__ ? 'staging' : 'production',
  enrolment: null,
  versionId: null,
}

export default buildSlice(
  'system',
  [ChangeEnvironment, ChangeVersion, ChangeEnrolment],
  sliceInitialState,
).reducer
