import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import Create from './Create'
import SetAnswer from './SetAnswer'
import ChangeAdvancement from './ChangeAdvancement'
import UpdateNodeField from './UpdateNodeField'
import Load from './Load'
import RemoveAdditionalDiagnoses from './RemoveAdditionalDiagnoses'
import AddAdditionalDiagnoses from './AddAdditionalDiagnoses'
import ChangeCustomDiagnoses from './ChangeCustomDiagnoses'
import ChangeAgreedDiagnoses from './ChangeAgreedDiagnoses'
import ChangeRefusedDiagnoses from './ChangeRefusedDiagnoses'

import AddAgreedDrugs from '@/Store/MedicalCase/Drugs/AddAgreedDrugs'
import RemoveAgreedDrugs from '@/Store/MedicalCase/Drugs/RemoveAgreedDrugs'
import AddRefusedDrugs from '@/Store/MedicalCase/Drugs/AddRefusedDrugs'
import RemoveRefusedDrugs from '@/Store/MedicalCase/Drugs/RemoveRefusedDrugs'
import ChangeAdditionalDrugs from '@/Store/MedicalCase/Drugs/ChangeAdditionalDrugs'
import ChangeAdditionalDrugDuration from '@/Store/MedicalCase/Drugs/ChangeAdditionalDrugDuration'
import ChangeCustomDrugs from '@/Store/MedicalCase/Drugs/ChangeCustomDrugs'
import ChangeCustomDrugDuration from '@/Store/MedicalCase/Drugs/ChangeCustomDrugDuration'

const sliceInitialState = {
  item: {},
}

export default buildSlice(
  'medicalCase',
  [
    Create,
    ChangeAdvancement,
    RemoveAdditionalDiagnoses,
    AddAdditionalDiagnoses,
    ChangeCustomDiagnoses,
    ChangeAgreedDiagnoses,
    ChangeRefusedDiagnoses,
    AddAgreedDrugs,
    RemoveAgreedDrugs,
    AddRefusedDrugs,
    RemoveRefusedDrugs,
    ChangeAdditionalDrugs,
    ChangeAdditionalDrugDuration,
    ChangeCustomDrugs,
    ChangeCustomDrugDuration,
    SetAnswer,
    UpdateNodeField,
    Load,
  ],
  sliceInitialState,
).reducer
