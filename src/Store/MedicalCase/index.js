import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import Create from './Create'
import SetAnswer from './SetAnswer'
import ChangeAdvancement from './ChangeAdvancement'
import UpdateNodeField from './UpdateNodeField'
import ChangeAdditionalDiagnosis from './ChangeAdditionalDiagnosis'
import ChangeCustomDiagnosis from './ChangeCustomDiagnosis'

const sliceInitialState = {
  item: {},
}

export default buildSlice(
  'scan',
  [
    Create,
    ChangeAdvancement,
    ChangeAdditionalDiagnosis,
    ChangeCustomDiagnosis,
    SetAnswer,
    UpdateNodeField,
  ],
  sliceInitialState,
).reducer
