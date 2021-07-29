/**
 * The internal imports
 */
import { store } from '@/Store'
import { getAvailableHealthcare, isHealthcareExcluded } from '@/Utils/Drug'

export default ({ diagnosisKey }) => {
  // Retrieve state values
  const state = store.getState()
  const medicalCase = state.medicalCase.item
  const nodes = state.algorithm.item.nodes
  const finalDiagnoses = state.medicalCase.item.diagnosis[diagnosisKey]
  const newFinalDiagnoses = {}

  // List of all agreed drugs
  const agreedDrugs = Object.values(finalDiagnoses)
    .map(finalDiagnosis =>
      Object.values(finalDiagnosis.drugs.agreed).map(drug => drug.id),
    )
    .flat()

  // Find for all final diagnosis the proposed drug
  Object.values(finalDiagnoses).map(finalDiagnosis => {
    const availableDrugs = getAvailableHealthcare(
      nodes[finalDiagnosis.id],
      'drugs',
    )
    const newProposed = availableDrugs.filter(
      drugId => !isHealthcareExcluded(drugId, agreedDrugs),
    )
    const newAgreed = JSON.parse(JSON.stringify(finalDiagnosis.drugs.agreed))
    const newAdditional = JSON.parse(JSON.stringify(finalDiagnosis.drugs.additional))
    const drugToRemove = Object.keys(finalDiagnosis.drugs.agreed).filter(
      agreedDrugId => !newProposed.includes(parseInt(agreedDrugId)),
    )

    drugToRemove.forEach(drugId => delete newAgreed[drugId])

    const agreedWithFormulations = {}
    Object.values(newAgreed).forEach(drug => {
      const drugFormulations = nodes[drug.id].formulations
      agreedWithFormulations[drug.id] = {
        ...drug,
        formulation_id:
          drugFormulations.length === 1
            ? drugFormulations[0].id
            : finalDiagnoses[finalDiagnosis.id].drugs.agreed[drug.id]
                ?.formulation_id,
      }
    })

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

    newFinalDiagnoses[finalDiagnosis.id] = {
      ...finalDiagnosis,
      drugs: {
        ...finalDiagnosis.drugs,
        proposed: newProposed,
        agreed: agreedWithFormulations,
        additional: additionalWithFormulations,
      },
    }
  })

  console.log(newFinalDiagnoses)

  return {
    ...medicalCase,
    diagnosis: {
      ...medicalCase.diagnosis,
      [diagnosisKey]: newFinalDiagnoses,
    },
  }
}
