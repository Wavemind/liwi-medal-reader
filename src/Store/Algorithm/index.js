import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import FetchOne from './FetchOne'
import Destroy from './Destroy'
import ChangeLanguage from './ChangeLanguage'

const sliceInitialState = {
  item: {},
  language: 'en',
}

export default buildSlice(
  'algorithm',
  [FetchOne, Destroy, ChangeLanguage],
  sliceInitialState,
).reducer
