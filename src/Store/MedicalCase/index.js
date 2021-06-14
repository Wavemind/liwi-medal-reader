import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import Create from './Create'
import SetAnswer from './SetAnswer'
import ChangeAdvancement from './ChangeAdvancement'
import UpdateNodeField from './UpdateNodeField'
import Load from './Load'

import AddAdditionalDiagnoses from './Diagnoses/AddAdditionalDiagnoses'
import RemoveAdditionalDiagnoses from './Diagnoses/RemoveAdditionalDiagnoses'
import AddAgreedDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAgreedDiagnoses'
import RemoveAgreedDiagnoses from '@/Store/MedicalCase/Diagnoses/RemoveAgreedDiagnoses'
import AddRefusedDiagnoses from '@/Store/MedicalCase/Diagnoses/AddRefusedDiagnoses'
import RemoveRefusedDiagnoses from './Diagnoses/RemoveRefusedDiagnoses'
import AddCustomDiagnoses from '@/Store/MedicalCase/Diagnoses/AddCustomDiagnoses'
import RemoveCustomDiagnoses from '@/Store/MedicalCase/Diagnoses/RemoveCustomDiagnoses'

import AddAdditionalDrugs from '@/Store/MedicalCase/Drugs/AddAdditionalDrugs'
import RemoveAdditionalDrugs from '@/Store/MedicalCase/Drugs/RemoveAdditionalDrugs'
import AddAgreedDrugs from '@/Store/MedicalCase/Drugs/AddAgreedDrugs'
import RemoveAgreedDrugs from '@/Store/MedicalCase/Drugs/RemoveAgreedDrugs'
import AddRefusedDrugs from '@/Store/MedicalCase/Drugs/AddRefusedDrugs'
import RemoveRefusedDrugs from '@/Store/MedicalCase/Drugs/RemoveRefusedDrugs'
import AddCustomDrugs from '@/Store/MedicalCase/Drugs/AddCustomDrugs'
import RemoveCustomDrugs from '@/Store/MedicalCase/Drugs/RemoveCustomDrugs'
import ChangeAdditionalDrugDuration from '@/Store/MedicalCase/Drugs/ChangeAdditionalDrugDuration'
import ChangeCustomDrugDuration from '@/Store/MedicalCase/Drugs/ChangeCustomDrugDuration'

const sliceInitialState = {
  item: {},
}

export default buildSlice(
  'medicalCase',
  [
    Create,
    ChangeAdvancement,
    SetAnswer,
    UpdateNodeField,
    Load,

    AddAdditionalDiagnoses,
    RemoveAdditionalDiagnoses,
    AddAgreedDiagnoses,
    RemoveAgreedDiagnoses,
    AddRefusedDiagnoses,
    RemoveRefusedDiagnoses,
    AddCustomDiagnoses,
    RemoveCustomDiagnoses,

    AddAdditionalDrugs,
    RemoveAdditionalDrugs,
    AddAgreedDrugs,
    RemoveAgreedDrugs,
    AddRefusedDrugs,
    RemoveRefusedDrugs,
    AddCustomDrugs,
    RemoveCustomDrugs,
    ChangeAdditionalDrugDuration,
    ChangeCustomDrugDuration,
  ],
  sliceInitialState,
).reducer
