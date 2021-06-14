import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import PatientInsert from './Patient/Insert'
import MedicalCaseGetAll from './MedicalCase/GetAll'

const sliceInitialState = {
  patient: {},
  medicalCase: { item: {} },
}

export default buildSlice(
  'database',
  [PatientInsert, MedicalCaseGetAll],
  sliceInitialState,
).reducer
