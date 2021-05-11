import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import ChangeEnvironment from './ChangeEnvironment'
import ChangeLanguage from './ChangeLanguage'

const sliceInitialState = {
  item: {},
  environment: __DEV__ ? 'staging' : 'production',
  language: 'en',
}

export default buildSlice(
  'system',
  [ChangeEnvironment, ChangeLanguage],
  sliceInitialState,
).reducer
