import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import InsertPatient from './InsertPatient'

export default buildSlice('database', [InsertPatient]).reducer
