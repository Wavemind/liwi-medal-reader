/**
 * The external imports
 */

/**
 * The internal imports
 */
import { store } from '@/Store'
import { getValidDiagnoses } from '@/Utils/MedicalCase'
import {
  findExcludedFinalDiagnoses,
  findProposedFinalDiagnoses,
} from '@/Utils/FinalDiagnosis'

export default () => {
  const state = store.getState()
  let mcDiagnosis = JSON.parse(JSON.stringify(state.medicalCase.item.diagnosis))
  const medicalCase = state.medicalCase.item
  const diagnoses = state.algorithm.item.diagnoses
  const validDiagnoses = getValidDiagnoses()
  const validDiagnosesId = validDiagnoses.map(diagnosis => diagnosis.id)

  mcDiagnosis.excluded = Object.values(diagnoses)
    .filter(diagnosis => !validDiagnosesId.includes(diagnosis.id))
    .map(diagnosis =>
      Object.values(diagnosis.final_diagnoses).map(
        final_diagnosis => final_diagnosis.id,
      ),
    )
    .flat()

  mcDiagnosis.proposed = validDiagnoses
    .map(diagnosis => findProposedFinalDiagnoses(diagnosis))
    .flat()

  const excludedDiagnosis = validDiagnoses
    .map(diagnosis =>
      findExcludedFinalDiagnoses(diagnosis).filter(
        finalDiagnosis => finalDiagnosis.value === false,
      ),
    )
    .flat()
    .map(finalDiagnosis => finalDiagnosis.id)

  mcDiagnosis.excluded = mcDiagnosis.excluded.concat(excludedDiagnosis)

  return {
    ...medicalCase,
    diagnosis: mcDiagnosis,
  }
}
