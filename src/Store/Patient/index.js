import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import Create from './Create'
import ChangeConsentFile from './ChangeConsentFile'
import ChangeConsent from './ChangeConsent'

const sliceInitialState = {
  item: {},
}

export default buildSlice(
  'patient',
  [Create, ChangeConsentFile, ChangeConsent],
  sliceInitialState,
).reducer
