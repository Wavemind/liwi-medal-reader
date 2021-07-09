import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'

import Step from './Step'
import Reset from './Reset'

const sliceInitialState = {
  item: {},
}

export default buildSlice('validation', [Step, Reset], sliceInitialState)
  .reducer
