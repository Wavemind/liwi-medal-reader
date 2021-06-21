import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import Save from './Save'

const sliceInitialState = {
  save: {},
}

export default buildSlice('databasePatientValues', [Save], sliceInitialState).reducer
