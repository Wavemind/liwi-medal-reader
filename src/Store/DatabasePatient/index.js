import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import PatientInsert from './Insert'
import PatientGetAllWithConsent from './GetAllWithConsent'
import PatientUpdate from './Update'
import PatientGetAll from './GetAll'

const sliceInitialState = {
  insert: {},
  update: {},
  getAllWithConsent: { item: {} },
  getAll: { item: {} },
}

export default buildSlice(
  'databasePatient',
  [PatientInsert, PatientGetAll, PatientGetAllWithConsent, PatientUpdate],
  sliceInitialState,
).reducer
