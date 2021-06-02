import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import ChangeEnvironment from './ChangeEnvironment'
import ChangeLanguage from './ChangeLanguage'
import ChangeVersion from './ChangeVersion'

const sliceInitialState = {
  item: {},
  environment: __DEV__ ? 'staging' : 'production',
  language: 'en',
  versionId: null,
}

export default buildSlice(
  'system',
  [ChangeEnvironment, ChangeLanguage, ChangeVersion],
  sliceInitialState,
).reducer
