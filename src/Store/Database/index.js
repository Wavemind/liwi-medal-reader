import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import PatientInsert from './Patient/Insert'
import MedicalCaseGetAll from './MedicalCase/GetAll'

export default buildSlice('database', [PatientInsert, MedicalCaseGetAll])
  .reducer
