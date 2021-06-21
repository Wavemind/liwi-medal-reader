import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'

import Step from './Step'

const sliceInitialState = {
  item: {},
}

export default buildSlice('validation', [Step], sliceInitialState).reducer
