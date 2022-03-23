/**
 * The external imports
 */
import orderBy from 'lodash/orderBy'

/**
 * The internal imports
 */
import { store } from '@/Store'

/**
 * Transforms the diagnosis structure in the store to a usable format for the formulations container
 * @returns {{}}
 */
const transformFormulations = (addCustom = false) => {
  const newDrugs = {}
  console.log('Je rentre')
  const nodes = store.getState().algorithm.item.nodes
  const additional = store.getState().medicalCase.item.diagnosis.additional
  const agreed = store.getState().medicalCase.item.diagnosis.agreed
  const customDiagnosis = store.getState().medicalCase.item.diagnosis.custom
  const diagnoses = store.getState().medicalCase.item.diagnosis

  const localDiagnoses = { additional, agreed }
  const keys = Object.keys(localDiagnoses)

  keys.forEach(diagnosisKey => {
    Object.values(localDiagnoses[diagnosisKey]).forEach(diagnosis => {
      keys.forEach(drugKey => {
        Object.values(diagnosis.drugs[drugKey]).forEach(drug => {
          const relatedDiagnosis = {
            diagnosisId: diagnosis.id,
            diagnosisKey,
            drugKey,
          }
          if (Object.keys(newDrugs).indexOf(drug.id.toString()) > -1) {
            newDrugs[drug.id].relatedDiagnoses.push(relatedDiagnosis)
          } else {
            const drugFormulations = nodes[drug.id].formulations

            newDrugs[drug.id] = {
              id: drug.id,
              relatedDiagnoses: [relatedDiagnosis],
              duration: drug?.duration, // TODO: NEED THIS SINAN
              custom: false,
              selectedFormulationId:
                drugFormulations.length === 1
                  ? drugFormulations[0].id
                  : diagnoses[diagnosisKey][diagnosis.id].drugs[drugKey][
                      drug.id
                    ].formulation_id,
            }
          }
        })
      })
    })
  })

  // Custom
  orderBy(Object.values(newDrugs), drug => nodes[drug.id].level_of_urgency, [
    'desc',
    'asc',
  ])

  if (addCustom) {
    // TODO: Probably better from SINAN
    Object.values(customDiagnosis).forEach(diagnosis => {
      Object.values(diagnosis.drugs).forEach(drug => {
        const relatedDiagnosis = {
          diagnosisId: diagnosis.id,
          diagnosisKey: 'custom',
          drugKey: 'custom',
          name: diagnosis.name,
        }

        newDrugs[drug.id] = {
          relatedDiagnoses: [relatedDiagnosis],
          selectedFormulationId: null,
          custom: true,
          ...drug,
        }
      })
    })
  }

  return newDrugs
}

export default transformFormulations
