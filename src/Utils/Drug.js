import { store } from '@/Store'
import { Config } from '@/Config'
import { uniq, getTopConditions, calculateCondition } from '@/Utils/MedicalCase'

export const getAvailableDrugs = finalDiagnosis => {
  const state = store.getState()
  let instances =
    state.algorithm.item.diagnoses[finalDiagnosis.diagnosis_id].final_diagnoses[
      finalDiagnosis.id
    ].instances
  instances = { ...instances, ...finalDiagnosis.drugs }

  const topConditions = getTopConditions(instances, true)
  const questionsToDisplay = []
  handleDrugs(topConditions, questionsToDisplay, instances)

  return uniq(questionsToDisplay)
}

export const isDrugExcluded = (drugId, agreedDrugs) => {
  const state = store.getState()
  const nodes = state.algorithm.item.nodes

  return nodes[drugId].excluding_nodes_ids.some(excludingDrugId =>
    agreedDrugs.includes(excludingDrugId),
  )
}

export const handleDrugs = (children, questionsToDisplay, instances) => {
  const state = store.getState()
  const nodes = state.algorithm.item.nodes
  const agreedFinalDiagnoses = state.medicalCase.item.diagnosis.agreed

  const agreedDrugs = Object.values(agreedFinalDiagnoses)
    .map(agreedFinalDiagnosis =>
      Object.values(agreedFinalDiagnosis.drugs.agreed).map(drug => drug.id),
    )
    .flat()

  children.forEach(instance => {
    if (instance.conditions.length === 0 || calculateCondition(instance)) {
      if (nodes[instance.id].category === Config.CATEGORIES.drug) {
        if (!isDrugExcluded(instance.id, agreedDrugs)) {
          questionsToDisplay.push(instance.id)
        }
      } else if (instance.children && instance.children.length > 0) {
        const childrenInstance = instance.children
          .filter(
            childId => nodes[childId].category !== Config.CATEGORIES.management,
          )
          .map(childId => instances[childId])
        handleDrugs(childrenInstance, questionsToDisplay, instances)
      }
    }
  })
}
