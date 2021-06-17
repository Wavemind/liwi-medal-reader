import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import MedicalCaseGetAll from './GetAll'

const sliceInitialState = {
  medicalCase: { item: {} },
}

export default buildSlice(
  'databaseMedicalCase',
  [MedicalCaseGetAll],
  sliceInitialState,
).reducer
