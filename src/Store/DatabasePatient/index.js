import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import PatientInsert from './Insert'
import PatientGetAllWithConsent from './GetAllWithConsent'

const sliceInitialState = {
  insert: {},
  getAllWithConsent: { item: {} },
}

export default buildSlice(
  'databasePatient',
  [PatientInsert, PatientGetAllWithConsent],
  sliceInitialState,
).reducer
