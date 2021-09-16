import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import ChangeEnvironment from './ChangeEnvironment'
import ChangeLanguage from './ChangeLanguage'
import ChangeVersion from './ChangeVersion'
import ChangeEnrolment from './ChangeEnrolment'

const sliceInitialState = {
  item: {},
  environment: __DEV__ ? 'staging' : 'production',
  appLanguage: 'en',
  algorithmLanguage: 'en',
  enrolment: null,
  versionId: null,
}

export default buildSlice(
  'system',
  [ChangeEnvironment, ChangeLanguage, ChangeVersion, ChangeEnrolment],
  sliceInitialState,
).reducer
