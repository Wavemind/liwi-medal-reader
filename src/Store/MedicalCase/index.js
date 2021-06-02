import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import Create from './Create'
import ChangeAdvancement from './ChangeAdvancement'
import ChangeAdditionalDiagnosis from './ChangeAdditionalDiagnosis'

const sliceInitialState = {
  item: {},
}

export default buildSlice(
  'scan',
  [Create, ChangeAdvancement, ChangeAdditionalDiagnosis],
  sliceInitialState,
).reducer
