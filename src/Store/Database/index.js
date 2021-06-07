import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import CreatePatient from './CreatePatient'

export default buildSlice('database', [CreatePatient]).reducer
