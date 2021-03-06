/**
 * The internal imports
 */
import { store } from '@/Store'
import { Config } from '@/Config'
import {
  uniq,
  calculateCondition,
  calculateConditionInverseFinalDiagnosis,
} from '@/Utils/MedicalCase'
import { translate } from '@/Translations/algorithm'
import i18n from '@/Translations/index'

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
  const nodes = state.algorithm.item.nodes
  let instances =
    state.algorithm.item.diagnoses[finalDiagnosis.diagnosis_id].final_diagnoses[
      finalDiagnosis.id
    ].instances

  instances = { ...instances, ...finalDiagnosis[key] }

  const questionsToDisplay = []
  if (key === 'drugs') {
    const allDrugs = Object.values(instances).filter(
      instance => nodes[instance.id].category === Config.CATEGORIES.drug,
    )
    handleDrugs(allDrugs, questionsToDisplay, instances, exclusion)
  } else {
    const allManagements = Object.values(instances).filter(
      instance => nodes[instance.id].category === Config.CATEGORIES.management,
    )
    handleManagements(allManagements, questionsToDisplay, instances)
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

/**
 * Recursive function tha will find all available managements for a final diagnosis
 * @param {Instance} managementInstances : management that we are testing
 * @param {*} questionsToDisplay : list of available managements we are updating
 * @param {Array<Instance>} instances : All the nodes in the final Diagnosis diagram
 */
export const handleManagements = (
  managementInstances,
  questionsToDisplay,
  instances,
) => {
  const state = store.getState()
  const mcNodes = state.medicalCase.item.nodes
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

  managementInstances.forEach(instance => {
    if (
      calculateConditionInverseFinalDiagnosis(
        instance.conditions,
        mcNodes,
        instances,
      )
    ) {
      if (nodes[instance.id].category === Config.CATEGORIES.management) {
        if (!isHealthcareExcluded(instance.id, managements)) {
          questionsToDisplay.push(instance.id)
        }
      }
    }
  })
}

/**
 * Recursive function tha will find all available drugs for a final diagnosis
 * @param {Instance} drugInstances : drug instance
 * @param {*} questionsToDisplay : list of available drug we are updating
 * @param {Array<Instance>} instances : All the nodes in the final Diagnosis diagram
 */
export const handleDrugs = (
  drugInstances,
  questionsToDisplay,
  instances,
  exclusion,
) => {
  const state = store.getState()
  const agreedFinalDiagnoses = state.medicalCase.item.diagnosis.agreed
  const mcNodes = state.medicalCase.item.nodes

  let agreedDrugs = []
  if (exclusion) {
    agreedDrugs = Object.values(agreedFinalDiagnoses)
      .map(agreedFinalDiagnosis =>
        Object.values(agreedFinalDiagnosis.drugs.agreed).map(drug => drug.id),
      )
      .flat()
  }

  drugInstances.forEach(instance => {
    if (
      calculateConditionInverseFinalDiagnosis(
        instance.conditions,
        mcNodes,
        instances,
      )
    ) {
      if (exclusion) {
        if (!isHealthcareExcluded(instance.id, agreedDrugs)) {
          questionsToDisplay.push(instance.id)
        }
      } else {
        questionsToDisplay.push(instance.id)
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

  // Test if drug exist in final diagnostic (in case of additional drug for a final diagnostic)
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

/**
 * Checks if drug has been agreed or not
 * @params {Object} drug
 * @returns boolean
 */
export const drugIsAgreed = drug => {
  const diagnoses = store.getState().medicalCase.item.diagnosis
  const agreedIndex = drug.diagnoses.findIndex(diagnosis =>
    Object.keys(diagnoses[diagnosis.key][diagnosis.id].drugs.agreed).includes(
      drug.id.toString(),
    ),
  )
  return agreedIndex > -1
}

/**
 * Checks if drug has been refused of not
 * @params {Object} drug
 * @returns boolean
 */
export const drugIsRefused = drug => {
  const diagnoses = store.getState().medicalCase.item.diagnosis
  const refusedIndex = drug.diagnoses.findIndex(diagnosis =>
    diagnoses[diagnosis.key][diagnosis.id].drugs.refused.includes(drug.id),
  )
  return refusedIndex > -1
}

/**
 * Transforms the diagnoses to group diagnoses per drug and orders everything by drug level_of_urgency
 * @returns object of drugs
 */
export const reworkAndOrderDrugs = () => {
  const state = store.getState()
  const nodes = state.algorithm.item.nodes
  const diagnoses = state.medicalCase.item.diagnosis

  const diagnosisTypes = ['agreed', 'additional', 'custom']
  const drugTypes = ['agreed', 'proposed', 'additional', 'custom']

  const newDrugs = {
    calculated: [],
    additional: [],
    custom: [],
  }

  diagnosisTypes.forEach(diagnosisType => {
    Object.values(diagnoses[diagnosisType]).forEach(diagnosis => {
      drugTypes.forEach(drugType => {
        // Test if key ['agreed', 'additional', 'custom'] exist (used for custom diagnose)

        if (drugType in diagnosis.drugs) {
          Object.values(diagnosis.drugs[drugType]).forEach(drug => {
            let drugId
            let drugKey = drugType

            // Proposed key in store give an array of ids
            drugId = drugType === 'proposed' ? drug : drug.id

            // Merge proposed and agreed keys into calculated for display
            if (['proposed', 'agreed'].includes(drugType)) {
              drugKey = 'calculated'
            }

            const drugIndex = getDrugIndex(newDrugs, drugId)
            const diagnosisLabel =
              diagnosisType === 'custom'
                ? diagnosis.name
                : translate(nodes[diagnosis.id].label)

            // Drug already exist
            if (drugIndex > -1) {
              const diagnosisExists = newDrugs[drugKey][
                drugIndex
              ].diagnoses.some(diag => diag.id === diagnosis.id)
              if (!diagnosisExists) {
                const currentDuration = newDrugs[drugKey][drugIndex].duration
                newDrugs[drugKey][drugIndex].duration =
                  drugType === 'agreed'
                    ? extractDuration(diagnosis.id, drugId, currentDuration)
                    : currentDuration
                newDrugs[drugKey][drugIndex].diagnoses.push({
                  id: diagnosis.id,
                  key: diagnosisType,
                  label: diagnosisLabel,
                })
              }
            } else {
              // Drug doesn't exist
              const drugLabel =
                drugType === 'custom'
                  ? drug.name
                  : translate(nodes[drugId].label)

              newDrugs[drugKey].push({
                id: drugId,
                key: drugType,
                label: drugLabel,
                levelOfUrgency: nodes[drugId]?.level_of_urgency,
                diagnoses: [
                  {
                    id: diagnosis.id,
                    key: diagnosisType,
                    label: diagnosisLabel,
                  },
                ],
                duration:
                  drugType === 'agreed'
                    ? extractDuration(diagnosis.id, drugId)
                    : drug.duration,
                addedAt: drug.addedAt,
                selectedFormulationId: drug.formulation_id,
              })
            }
          })
        }
      })
    })
  })

  return newDrugs
}

/**
 * Returns the index of the drug in drugs object
 * @param {*} drugs object
 * @param {*} drugId integer
 * @returns integer
 */
const getDrugIndex = (drugs, drugId) => {
  for (const drugType of Object.values(drugs)) {
    const foundIndex = drugType.findIndex(drug => drug.id === drugId)
    if (foundIndex > -1) {
      return foundIndex
    }
  }
  return -1
}

/**
 * Extracts the duration from the current diagnosis and checks if readable
 * @param {*} diagnosisId integer
 * @param {*} drugId integer
 * @param {*} currentDuration integer || string
 * @returns integer || string
 */
const extractDuration = (diagnosisId, drugId, currentDuration = 0) => {
  const drugInstance =
    store.getState().algorithm.item.nodes[diagnosisId].drugs[drugId]

  if (drugInstance.is_pre_referral) {
    return i18n.t('formulations.drug.pre_referral_duration')
  }

  if (Number.isInteger(currentDuration)) {
    const result = translate(drugInstance.duration).match(
      new RegExp(/^\d{1,2}$/g),
    )
    if (result) {
      const newDuration = parseInt(result[0], 10)
      if (newDuration > currentDuration) {
        return parseInt(result[0], 10)
      } else {
        return currentDuration
      }
    }
  }
  return i18n.t('containers.medical_case.drugs.duration_invalid')
}

/**
 * Formats the duration string to remove undesired characters
 * @param {*} duration string
 * @returns string of float
 */
export const formatDuration = duration => {
  const regWithComma = /^[0-9,]+$/

  // Replace comma with dot
  if (regWithComma.test(duration)) {
    duration = duration.replace(',', '.')
  }

  // Remove char that are not number or dot
  duration = duration.replace(/[^0-9.]/g, '')

  // Parse to float if value is not empty and last char is not dot
  if (duration !== '' && duration.charAt(duration.length - 1) !== '.') {
    duration = parseFloat(duration)
  }

  return duration
}
