import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import Create from './Create'
import SetAnswer from './SetAnswer'
import ChangeAdvancement from './ChangeAdvancement'
import UpdateNodeField from './UpdateNodeField'
import ChangeAdditionalDiagnoses from './ChangeAdditionalDiagnoses'
import ChangeCustomDiagnoses from './ChangeCustomDiagnoses'
import ChangeAgreedDiagnoses from './ChangeAgreedDiagnoses'
import ChangeRefusedDiagnoses from './ChangeRefusedDiagnoses'

import AddAgreedDrugs from '@/Store/MedicalCase/Drugs/AddAgreedDrugs'
import RemoveAgreedDrugs from '@/Store/MedicalCase/Drugs/RemoveAgreedDrugs'
import AddRefusedDrugs from '@/Store/MedicalCase/Drugs/AddRefusedDrugs'
import RemoveRefusedDrugs from '@/Store/MedicalCase/Drugs/RemoveRefusedDrugs'
import ChangeAdditionalDrugs from '@/Store/MedicalCase/Drugs/ChangeAdditionalDrugs'
import ChangeAdditionalDrugDuration from '@/Store/MedicalCase/Drugs/ChangeAdditionalDrugDuration'

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
    AddAgreedDrugs,
    RemoveAgreedDrugs,
    AddRefusedDrugs,
    RemoveRefusedDrugs,
    ChangeAdditionalDrugs,
    ChangeAdditionalDrugDuration,
    SetAnswer,
    UpdateNodeField,
  ],
  sliceInitialState,
).reducer
