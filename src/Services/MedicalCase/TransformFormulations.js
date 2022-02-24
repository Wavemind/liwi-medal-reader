import { store } from '@/Store'

/**
 * Transforms the diagnosis structure in the store to a usable format for the formulations container
 * @returns {{}}
 */
const transformFormulations = () => {
  const newDrugs = {}

  const nodes = store.getState().algorithm.item.nodes
  const additional = store.getState().medicalCase.item.diagnosis.additional
  const agreed = store.getState().medicalCase.item.diagnosis.agreed
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

  return newDrugs
}

export default transformFormulations
