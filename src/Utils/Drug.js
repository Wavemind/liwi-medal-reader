import { store } from '@/Store'
import { Config } from '@/Config'
import { uniq, getTopConditions, calculateCondition } from '@/Utils/MedicalCase'
import { translate } from '@/Translations/algorithm'

/**
 * Returns all available drugs for a specific final diagnosis
 * @param {finalDiagnosis} finalDiagnosis : the final diagnosis we want to get the drugs from
 * @returns {Array<Drug>} : Available drugs
 */
export const getAvailableHealthcare = (
  finalDiagnosis,
  key,
  exclusion = true,
) => {
  const state = store.getState()
  let instances =
    state.algorithm.item.diagnoses[finalDiagnosis.diagnosis_id].final_diagnoses[
      finalDiagnosis.id
    ].instances

  instances = { ...instances, ...finalDiagnosis[key] }

  const topConditions = getTopConditions(instances, true)
  const questionsToDisplay = []
  if (key === 'drugs') {
    handleDrugs(topConditions, questionsToDisplay, instances, exclusion)
  } else {
    handleManagements(topConditions, questionsToDisplay, instances)
  }

  return uniq(questionsToDisplay)
}

/**
 * Tells if a drug is excluded by another drug
 * @param {Integer} drugId : the Id of the drug we are testing
 * @param {Array<Integer>} agreedHealthCares : Array of drug id or managements id
 * @returns {Boolean} : Tells if a drug is excluded by another drug
 */
export const isHealthcareExcluded = (healthCareId, agreedHealthCares) => {
  const state = store.getState()
  const nodes = state.algorithm.item.nodes

  return nodes[healthCareId].excluding_nodes_ids.some(excludingHealthCareId =>
    agreedHealthCares.includes(excludingHealthCareId),
  )
}

export const handleManagements = (children, questionsToDisplay, instances) => {
  const state = store.getState()
  const nodes = state.algorithm.item.nodes
  const agreedFinalDiagnoses = state.medicalCase.item.diagnosis.agreed
  const managements = Object.values(agreedFinalDiagnoses)
    .map(agreedFinalDiagnosis =>
      Object.values(nodes[agreedFinalDiagnosis.id].managements)
        .filter(management => {
          if (calculateCondition(management)) {
            return management
          }
        })
        .map(management => management.id),
    )
    .flat()

  children.forEach(instance => {
    if (calculateCondition(instance)) {
      if (nodes[instance.id].category === Config.CATEGORIES.management) {
        if (!isHealthcareExcluded(instance.id, managements)) {
          questionsToDisplay.push(instance.id)
        }
      } else if (instance.children && instance.children.length > 0) {
        const childrenInstance = instance.children
          .filter(childId => nodes[childId].category !== Config.CATEGORIES.drug)
          .map(childId => instances[childId])
        handleManagements(childrenInstance, questionsToDisplay, instances)
      }
    }
  })
}
/**
 * Recursive function tha will find all available drugs for a final diagnosis
 * @param {Instance} children : The Treatment condition / drug that we are testing
 * @param {*} questionsToDisplay : list of available drug we are updating
 * @param {Array<Instance>} instances : All the nodes in the final Diagnosis diagram
 */
export const handleDrugs = (
  children,
  questionsToDisplay,
  instances,
  exclusion,
) => {
  const state = store.getState()
  const nodes = state.algorithm.item.nodes
  const agreedFinalDiagnoses = state.medicalCase.item.diagnosis.agreed

  let agreedDrugs = []
  if (exclusion) {
    agreedDrugs = Object.values(agreedFinalDiagnoses)
      .map(agreedFinalDiagnosis =>
        Object.values(agreedFinalDiagnosis.drugs.agreed).map(drug => drug.id),
      )
      .flat()
  }

  children.forEach(instance => {
    if (calculateCondition(instance)) {
      if (nodes[instance.id].category === Config.CATEGORIES.drug) {
        if (exclusion) {
          if (!isHealthcareExcluded(instance.id, agreedDrugs)) {
            questionsToDisplay.push(instance.id)
          }
        } else {
          questionsToDisplay.push(instance.id)
        }
      } else if (instance.children && instance.children.length > 0) {
        const childrenInstance = instance.children
          .filter(
            childId => nodes[childId].category !== Config.CATEGORIES.management,
          )
          .map(childId => instances[childId])
        handleDrugs(childrenInstance, questionsToDisplay, instances, exclusion)
      }
    }
  })
}

/**
 * Display instance description of drug if present. Otherwise, drug
 * @params {Integer} drugId
 * @params {Integer} finalDiagnosticId
 */
export const displayDrugDescription = (drugId, finalDiagnosticId) => {
  const nodes = store.getState().algorithm.item.nodes

  if (nodes[finalDiagnosticId].drugs[drugId]) {
    const drugInstanceDescription = translate(
      nodes[finalDiagnosticId].drugs[drugId].description,
      false,
    )

    if (drugInstanceDescription !== '') {
      return drugInstanceDescription
    }
  }
  return translate(nodes[drugId].description)
}
