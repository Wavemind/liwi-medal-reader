import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import Create from './Create'
import SetAnswer from './SetAnswer'
import ChangeAdvancement from './ChangeAdvancement'
import UpdateNodeField from './UpdateNodeField'
import ChangeAdditionalDiagnosis from './ChangeAdditionalDiagnosis'
import Load from './Load'

const sliceInitialState = {
  item: {},
}

export default buildSlice(
  'medicalCase',
  [
    Create,
    ChangeAdvancement,
    ChangeAdditionalDiagnosis,
    SetAnswer,
    UpdateNodeField,
    Load,
  ],
  sliceInitialState,
).reducer
