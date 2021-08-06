import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import MedicalCaseGetAll from './GetAll'
import MedicalCaseUpdate from './Update'
import MedicalCaseInsert from './Insert'
import MedicalCaseLock from './Lock'
import MedicalCaseUnLock from './Unlock'

const sliceInitialState = {
  medicalCase: { item: {} },
  update: {},
}

export default buildSlice(
  'databaseMedicalCase',
  [
    MedicalCaseGetAll,
    MedicalCaseUpdate,
    MedicalCaseInsert,
    MedicalCaseLock,
    MedicalCaseUnLock,
  ],
  sliceInitialState,
).reducer
