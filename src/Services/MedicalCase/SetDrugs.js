/**
 * The internal imports
 */
import { store } from '@/Store'
import { getNewDiagnoses } from '@/Utils/FinalDiagnosis'

export default () => {
  // Retrieve state values
  const state = store.getState()
  const medicalCase = state.medicalCase.item
  const agreedFinalDiagnoses = state.medicalCase.item.diagnosis.agreed
  const additionalFinalDiagnoses = state.medicalCase.item.diagnosis.additional

  return {
    ...medicalCase,
    diagnosis: {
      ...medicalCase.diagnosis,
      agreed: getNewDiagnoses(agreedFinalDiagnoses, true),
      additional: getNewDiagnoses(additionalFinalDiagnoses),
    },
  }
}
