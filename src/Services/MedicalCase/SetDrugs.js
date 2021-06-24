/**
 * The internal imports
 */
import { store } from '@/Store'
import { getAvailableDrugs, isDrugExcluded } from '@/Utils/Drug'

export default () => {
  // Retrieve state values
  const state = store.getState()
  const medicalCase = state.medicalCase.item
  const nodes = state.algorithm.item.nodes
  const agreedFinalDiagnoses = state.medicalCase.item.diagnosis.agreed
  const newFinalDiagnoses = {}

  // List of all agreed drugs
  const agreedDrugs = Object.values(agreedFinalDiagnoses)
    .map(finalDiagnosis =>
      Object.values(finalDiagnosis.drugs.agreed).map(drug => drug.id),
    )
    .flat()

  // Find for all final diagnosis the proposed drug
  Object.values(agreedFinalDiagnoses).map(finalDiagnosis => {
    const availableDrugs = getAvailableDrugs(nodes[finalDiagnosis.id])
    const newProposed = availableDrugs.filter(
      drugId => !isDrugExcluded(drugId, agreedDrugs),
    )
    const newAgreed = JSON.parse(JSON.stringify(finalDiagnosis.drugs.agreed))
    const drugToRemove = Object.keys(finalDiagnosis.drugs.agreed).filter(
      agreedDrugId => !newProposed.includes(parseInt(agreedDrugId)),
    )

    drugToRemove.forEach(drugId => delete newAgreed[drugId])

    newFinalDiagnoses[finalDiagnosis.id] = {
      ...finalDiagnosis,
      drugs: {
        ...finalDiagnosis.drugs,
        proposed: newProposed,
        agreed: newAgreed,
      },
    }
  })

  return {
    ...medicalCase,
    diagnosis: {
      ...medicalCase.diagnosis,
      agreed: newFinalDiagnoses,
    },
  }
}
