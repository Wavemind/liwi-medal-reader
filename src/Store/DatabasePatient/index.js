import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import PatientInsert from './Insert'
import PatientGetAllWithConsent from './GetAllWithConsent'
import PatientUpdate from './Update'

const sliceInitialState = {
  insert: {},
  update: {},
  getAllWithConsent: { item: {} },
}

export default buildSlice(
  'databasePatient',
  [PatientInsert, PatientGetAllWithConsent, PatientUpdate],
  sliceInitialState,
).reducer
