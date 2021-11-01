import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import FetchOne from './FetchOne'
import ChangeClinician from './ChangeClinician'
import ChangeLanguage from './ChangeLanguage'
import Destroy from './Destroy'

const sliceInitialState = {
  item: {},
  clinician: {
    app_default_language: 'en',
    algo_default_language: 'en',
  },
}

export default buildSlice(
  'healthFacility',
  [FetchOne, ChangeClinician, Destroy, ChangeLanguage],
  sliceInitialState,
).reducer

// appLanguage: 'en',
// algorithmLanguage: 'en',
