import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import ChangeFilters from './ChangeFilters'
import ClearFilters from './ClearFilters'

export default buildSlice('filters', [ChangeFilters, ClearFilters], {
  medicalCases: {},
  patients: {},
}).reducer
