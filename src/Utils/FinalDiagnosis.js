/**
 * The external imports
 */

/**
 * The internal imports
 */
import {
  calculateCondition,
  getTopConditions,
  reduceConditions,
  uniq,
} from '@/Utils/MedicalCase'
import { store } from '@/Store'
import { Config } from '@/Config'

export const findProposedFinalDiagnoses = diagnosis => {
  const topConditions = getTopConditions(diagnosis.instances)
  return uniq(
    topConditions
      .map(instance => searchFinalDiagnoses(instance, diagnosis.instances))
      .flat(),
  )
}

export const findExcludedFinalDiagnoses = diagnosis => {
  const topConditions = getTopConditions(diagnosis.instances)
  return Object.values(diagnosis.final_diagnoses).map(finalDiagnosis => {
    return {
      id: finalDiagnosis.id,
      value: reduceConditions(
        topConditions.map(instance =>
          searchExcludedFinalDiagnoses(
            instance,
            diagnosis.instances,
            finalDiagnosis,
          ),
        ),
      ),
    }
  })
}
const searchFinalDiagnoses = (instance, instances, finalDiagnoses = []) => {
  const state = store.getState()
  const nodes = state.algorithm.item.nodes

  const instanceCondition = calculateCondition(instance)

  if (instanceCondition) {
    instance.children.forEach(childId => {
      if (nodes[childId].type === Config.NODE_TYPES.finalDiagnosis) {
        finalDiagnoses.push(childId)
      } else {
        searchFinalDiagnoses(instances[childId], instances, finalDiagnoses)
      }
    })
  }
  return uniq(finalDiagnoses)
}

const searchExcludedFinalDiagnoses = (instance, instances, finalDiagnosis) => {
  const state = store.getState()
  const nodes = state.algorithm.item.nodes
  const mcNode = state.medicalCase.item.nodes[instance.id]

  const instanceCondition = calculateCondition(instance)

  if (instanceCondition && mcNode.answer === null) {
    return null
  }

  if (instanceCondition) {
    return reduceConditions(
      instance.children.map(childId => {
        if (nodes[childId].type === Config.NODE_TYPES.finalDiagnosis) {
          return (
            finalDiagnosis.id === childId && calculateCondition(nodes[childId])
          )
        } else {
          return searchExcludedFinalDiagnoses(
            instances[childId],
            instances,
            finalDiagnosis,
          )
        }
      }),
    )
  } else {
    return false
  }
}
