import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import FetchOne from './FetchOne'
import Destroy from './Destroy'

const sliceInitialState = {
  item: {},
}

export default buildSlice('algorithm', [FetchOne, Destroy], sliceInitialState)
  .reducer
