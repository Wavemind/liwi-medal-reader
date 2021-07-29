/**
 * The internal imports
 */
import { store } from '@/Store'
import { Config } from '@/Config'

import { handleChildren, getTopConditions, uniq } from '@/Utils/MedicalCase'

export default () => {
  const state = store.getState()
  const agreed = state.medicalCase.item.diagnosis.agreed
  const additional = state.medicalCase.item.diagnosis.additional
  const nodes = state.algorithm.item.nodes
  const diagnoses = state.algorithm.item.diagnoses
  const questionsToDisplay = []

  const finalDiagnostics = { ...agreed, ...additional }

  Object.values(finalDiagnostics).forEach(agreedFinalDiagnostic => {
    const finalDiagnostic = nodes[agreedFinalDiagnostic.id]

    const instances =
      diagnoses[finalDiagnostic.diagnosis_id].final_diagnoses[
        finalDiagnostic.id
      ].instances
    const topConditions = getTopConditions(instances, true)

    handleChildren(
      topConditions,
      null,
      questionsToDisplay,
      instances,
      [Config.CATEGORIES.treatmentQuestion],
      finalDiagnostic.diagnosis_id,
      Config.NODE_TYPES.diagnosis,
      false,
    )
  })

  return uniq(questionsToDisplay)
}
