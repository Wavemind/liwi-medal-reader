import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import Create from './Create'
import SetAnswer from './SetAnswer'
import ChangeAdvancement from './ChangeAdvancement'
import UpdateNodeField from './UpdateNodeField'
import Load from './Load'
import ChangeAdditionalDiagnoses from './ChangeAdditionalDiagnoses'
import ChangeCustomDiagnoses from './ChangeCustomDiagnoses'
import ChangeAgreedDiagnoses from './ChangeAgreedDiagnoses'
import ChangeRefusedDiagnoses from './ChangeRefusedDiagnoses'
import HandleComplaintCategories from './HandleComplaintCategories'

const sliceInitialState = {
  item: {},
}

export default buildSlice(
  'medicalCase',
  [
    Create,
    ChangeAdvancement,
    ChangeAdditionalDiagnoses,
    ChangeCustomDiagnoses,
    ChangeAgreedDiagnoses,
    ChangeRefusedDiagnoses,
    HandleComplaintCategories,
    SetAnswer,
    UpdateNodeField,
    Load,
  ],
  sliceInitialState,
).reducer
