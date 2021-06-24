/**
 * The internal imports
 */
import {
  calculateCondition,
  getTopConditions,
  uniq,
  reduceConditions,
  diagramConditionsValues,
} from '@/Utils/MedicalCase'
import { store } from '@/Store'
import { Config } from '@/Config'

/**
 * Finds all the proposed final diagnoses in the current medical case
 * @param {Diagnosis} diagnosis : the diagnosis we want to test
 * @returns {Array<finalDiagnoses>} : Final Diagnoses found for the diagnosis passed in params
 */
export const findProposedFinalDiagnoses = diagnosis => {
  const topConditions = getTopConditions(diagnosis.instances)
  return uniq(
    topConditions
      .map(instance => searchFinalDiagnoses(instance, diagnosis.instances))
      .flat(),
  )
}

/**
 * For one specific instance we will check if it's condition is valid and look further until we find a Final Diagnosis
 * @param {Instance} instance : The instance we are testing
 * @param {Array<Instance>} instances : All the instances of the current diagnosis
 * @param {Array<Integer>} finalDiagnoses : an array of id we populate when we find a final diagnosis
 * @returns we return finalDiagnoses
 */
const searchFinalDiagnoses = (instance, instances, finalDiagnoses = []) => {
  const state = store.getState()
  const nodes = state.algorithm.item.nodes
  const mcNodes = state.medicalCase.item.nodes

  const instanceCondition = calculateCondition(instance)

  if (instanceCondition) {
    instance.children.forEach(childId => {
      if (nodes[childId].type === Config.NODE_TYPES.finalDiagnosis) {
        const finalDiagnosisCondition = reduceConditions(
          diagramConditionsValues(childId, instance, mcNodes),
        )

        if (finalDiagnosisCondition === true) {
          finalDiagnoses.push(childId)
        }
      } else {
        searchFinalDiagnoses(instances[childId], instances, finalDiagnoses)
      }
    })
  }
  return finalDiagnoses
}

/**
 * gets the status for the diagnosis passed in params
 * @param {Diagnosis} diagnosis : the diagnosis we want to test
 * @returns {Array<{id: Integer, value: Boolean}>} : Final Diagnoses found and their status
 */
export const findExcludedFinalDiagnoses = diagnosis => {
  const topConditions = getTopConditions(diagnosis.instances)
  return Object.values(diagnosis.final_diagnoses).map(finalDiagnosis => ({
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
  }))
}

// TODO AT SOME POINT WHEN DIAGNOSES ARE MISSING IN EXCLUDED
/**
 * Looks for a final diagnosis in a diagram and will give its status
 * @param {Instance} instance : The instance we are testing
 * @param {Array<Instance>} instances : All the instances of the current diagnosis
 * @param {FinalDiagnosis} finalDiagnosis : The final diagnosis we are looking for
 * @returns
 */
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
