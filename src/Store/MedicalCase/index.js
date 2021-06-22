import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import Create from './Create'
import SetAnswer from './SetAnswer'
import ChangeAdvancement from './ChangeAdvancement'
import UpdateNodeField from './UpdateNodeField'
import Load from './Load'
import HandleComplaintCategories from './HandleComplaintCategories'
import HandleDateFormulas from './HandleDateFormulas'
import Destroy from './Destroy'

// Activities
import AddStepActivities from './AddStepActivities'
import ClearActivities from './ClearActivities'

// Final Diagnoses
import SetDiagnoses from './Diagnoses/SetDiagnoses'
import AddAdditionalDiagnoses from './Diagnoses/AddAdditionalDiagnoses'
import RemoveAdditionalDiagnoses from './Diagnoses/RemoveAdditionalDiagnoses'
import AddAgreedDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAgreedDiagnoses'
import RemoveAgreedDiagnoses from '@/Store/MedicalCase/Diagnoses/RemoveAgreedDiagnoses'
import AddRefusedDiagnoses from '@/Store/MedicalCase/Diagnoses/AddRefusedDiagnoses'
import RemoveRefusedDiagnoses from './Diagnoses/RemoveRefusedDiagnoses'
import AddCustomDiagnoses from '@/Store/MedicalCase/Diagnoses/AddCustomDiagnoses'
import RemoveCustomDiagnoses from '@/Store/MedicalCase/Diagnoses/RemoveCustomDiagnoses'
// Drugs
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
// Formulations
import ChangeFormulations from '@/Store/MedicalCase/ChangeFormulations'
// Arm Control
import ArmAddCustomDrugs from '@/Store/MedicalCase/ArmControl/ArmAddCustomDrugs'
import ArmRemoveCustomDrugs from '@/Store/MedicalCase/ArmControl/ArmRemoveCustomDrugs'
import ArmChangeCustomDrugDuration from '@/Store/MedicalCase/ArmControl/ArmChangeCustomDrugDuration'

const sliceInitialState = {
  item: {},
}

export default buildSlice(
  'medicalCase',
  [
    Create,
    Destroy,
    ChangeAdvancement,
    HandleComplaintCategories,
    HandleDateFormulas,
    SetAnswer,
    UpdateNodeField,
    Load,
    // Activities
    AddStepActivities,
    ClearActivities,
    // Diagnoses
    SetDiagnoses,
    AddAdditionalDiagnoses,
    RemoveAdditionalDiagnoses,
    AddAgreedDiagnoses,
    RemoveAgreedDiagnoses,
    AddRefusedDiagnoses,
    RemoveRefusedDiagnoses,
    AddCustomDiagnoses,
    RemoveCustomDiagnoses,
    // Drugs
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
    // Formulations
    ChangeFormulations,
    // Arm Control
    ArmAddCustomDrugs,
    ArmRemoveCustomDrugs,
    ArmChangeCustomDrugDuration,
  ],
  sliceInitialState,
).reducer
