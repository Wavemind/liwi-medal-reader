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
import { getAvailableHealthcare, isHealthcareExcluded } from '@/Utils/Drug'

/**
 * Finds all the proposed final diagnoses in the current medical case
 * @param {Diagnosis} diagnosis : the diagnosis we want to test
 * @returns {Array<finalDiagnoses>} : Final Diagnoses found for the diagnosis passed in params
 */
export const findProposedFinalDiagnoses = diagnosis => {
  const topConditions = getTopConditions(diagnosis.instances)
  return uniq(
    topConditions
      .map(instance =>
        searchFinalDiagnoses(instance, diagnosis.instances, diagnosis.id),
      )
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
const searchFinalDiagnoses = (
  instance,
  instances,
  sourceId = null,
  finalDiagnoses = [],
) => {
  const state = store.getState()
  const nodes = state.algorithm.item.nodes
  const mcNodes = state.medicalCase.item.nodes

  const instanceCondition = calculateCondition(instance, sourceId)

  if (instanceCondition) {
    instance.children.forEach(childId => {
      if (nodes[childId].type === Config.NODE_TYPES.finalDiagnosis) {
        const finalDiagnosisCondition = reduceConditions(
          diagramConditionsValues(childId, instance, mcNodes),
        )

        if (finalDiagnosisCondition) {
          finalDiagnoses.push(childId)
        }
      } else {
        searchFinalDiagnoses(
          instances[childId],
          instances,
          instance.id,
          finalDiagnoses,
        )
      }
    })
  }
  return finalDiagnoses
}

/**
 * Processes the final diagnosis and calculate the state of the drugs
 * @param {Object<FinalDiagnosis} finalDiagnoses list of final diagnosis to process
 * @param {Boolean} removeDrugs tells if I need to filter the drugs
 * @returns
 */
export const getNewDiagnoses = (finalDiagnoses, removeDrugs = false) => {
  const nodes = store.getState().algorithm.item.nodes
  const newFinalDiagnoses = {}
  const newAgreed = {}

  // Regroup all agreed drugs for exclusions
  Object.values(finalDiagnoses).forEach(finalDiagnosis => {
    Object.values(finalDiagnosis.drugs.agreed).forEach(drug => {
      newAgreed[drug.id] = {
        ...drug,
        formulation_id: drug.formulation_id || null,
        finalDiagnosisId: finalDiagnosis.id,
      }
    })
  })

  // Find for all final diagnosis the proposed drug
  Object.values(finalDiagnoses).map(finalDiagnosis => {
    const availableDrugs = getAvailableHealthcare(
      nodes[finalDiagnosis.id],
      'drugs',
      false,
    )
    const newAdditional = JSON.parse(
      JSON.stringify(finalDiagnosis.drugs.additional),
    )

    if (removeDrugs) {
      const drugToRemove = Object.keys(finalDiagnosis.drugs.agreed).filter(
        agreedDrugId => !availableDrugs.includes(Number(agreedDrugId)),
      )

      drugToRemove.forEach(drugId => delete newAgreed[drugId])
    }

    const newProposed = availableDrugs.filter(
      drugId =>
        !isHealthcareExcluded(
          drugId,
          Object.values(newAgreed).map(drug => drug.id),
        ),
    )

    const agreedWithFormulations = {}

    // Pre select formulation with there is only one
    Object.values(newAgreed).forEach(drug => {
      if (drug.finalDiagnosisId === finalDiagnosis.id) {
        const drugFormulations = nodes[drug.id].formulations
        agreedWithFormulations[drug.id] = {
          ...drug,
          formulation_id:
            drugFormulations.length === 1
              ? drugFormulations[0].id
              : finalDiagnosis.drugs.agreed[drug.id]?.formulation_id,
        }
      }
    })

    // Pre select formulation with there is only one
    const additionalWithFormulations = {}
    Object.values(newAdditional).forEach(drug => {
      const drugFormulations = nodes[drug.id].formulations
      additionalWithFormulations[drug.id] = {
        ...drug,
        formulation_id:
          drugFormulations.length === 1
            ? drugFormulations[0].id
            : finalDiagnoses[finalDiagnosis.id].drugs.additional[drug.id]
                ?.formulation_id,
      }
    })

    // management calculations
    const managements = getAvailableHealthcare(
      nodes[finalDiagnosis.id],
      'managements',
    )

    newFinalDiagnoses[finalDiagnosis.id] = {
      ...finalDiagnosis,
      drugs: {
        ...finalDiagnosis.drugs,
        proposed: newProposed,
        agreed: agreedWithFormulations,
        additional: additionalWithFormulations,
      },
      managements,
    }
  })

  return newFinalDiagnoses
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
