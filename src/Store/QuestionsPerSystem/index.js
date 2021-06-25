import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import MedicalHistory from './MedicalHistory'
import PhysicalExam from './PhysicalExam'

const sliceInitialState = {
  item: {
    medicalHistory: [],
    physicalExam: [],
  },
}

export default buildSlice(
  'questionsPerSystem',
  [MedicalHistory, PhysicalExam],
  sliceInitialState,
).reducer
