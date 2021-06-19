/**
 * The internal imports
 */
import { store } from '@/Store'
import { getValidDiagnoses } from '@/Utils/MedicalCase'
import {
  findProposedFinalDiagnoses,
  findExcludedFinalDiagnoses,
} from '@/Utils/FinalDiagnosis'

export default () => {
  const state = store.getState()
  let mcDiagnosis = JSON.parse(JSON.stringify(state.medicalCase.item.diagnosis))
  const medicalCase = state.medicalCase.item
  const diagnoses = state.algorithm.item.diagnoses
  const nodes = state.algorithm.item.nodes
  const validDiagnoses = getValidDiagnoses()
  const validDiagnosesId = validDiagnoses.map(diagnosis => diagnosis.id)

  // Exclude diagnoses based on cut off and complaint category exclusion
  mcDiagnosis.excluded = Object.values(diagnoses)
    .filter(diagnosis => !validDiagnosesId.includes(diagnosis.id))
    .map(diagnosis =>
      Object.values(diagnosis.final_diagnoses).map(
        final_diagnosis => final_diagnosis.id,
      ),
    )
    .flat()

  // Find all the included diagnoses
  mcDiagnosis.proposed = validDiagnoses
    .map(diagnosis => findProposedFinalDiagnoses(diagnosis))
    .flat()

  mcDiagnosis.proposed = mcDiagnosis.proposed.filter(finalDiagnosisId => {
    return !nodes[finalDiagnosisId].excluding_final_diagnoses.some(
      // Adds in exclusion if excluding final diagnosis is in agreed
      excludingFinalDiagnosisId => {
        if (
          Object.values(mcDiagnosis.agreed)
            .map(a => a.id)
            .includes(excludingFinalDiagnosisId)
        ) {
          mcDiagnosis.excluded = mcDiagnosis.excluded.concat(finalDiagnosisId)
        }
        return (
          mcDiagnosis.proposed.includes(excludingFinalDiagnosisId) &&
          !mcDiagnosis.refused.includes(excludingFinalDiagnosisId)
        )
      },
    )
  })

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
