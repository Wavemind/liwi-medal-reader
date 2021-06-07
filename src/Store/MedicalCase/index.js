import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import Create from './Create'
import SetAnswer from './SetAnswer'
import ChangeAdvancement from './ChangeAdvancement'
import UpdateNodeField from './UpdateNodeField'
import ChangeAdditionalDiagnoses from './ChangeAdditionalDiagnoses'
import ChangeCustomDiagnoses from './ChangeCustomDiagnoses'
import ChangeAgreedDiagnoses from './ChangeAgreedDiagnoses'
import ChangeRefusedDiagnoses from './ChangeRefusedDiagnoses'

const sliceInitialState = {
  item: {},
}

export default buildSlice(
  'scan',
  [
    Create,
    ChangeAdvancement,
    ChangeAdditionalDiagnoses,
    ChangeCustomDiagnoses,
    ChangeAgreedDiagnoses,
    ChangeRefusedDiagnoses,
    SetAnswer,
    UpdateNodeField,
  ],
  sliceInitialState,
).reducer
