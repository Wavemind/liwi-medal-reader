/**
 * The internal imports
 */
import { store } from '@/Store'
import { getAvailableDrugs, isDrugExcluded } from '@/Utils/Drug'

export default () => {
  const state = store.getState()
  const medicalCase = state.medicalCase.item
  const nodes = state.algorithm.item.nodes
  const agreedFinalDiagnoses = state.medicalCase.item.diagnosis.agreed

  const agreedDrugs = Object.values(agreedFinalDiagnoses)
    .map(agreedFinalDiagnosis =>
      Object.values(agreedFinalDiagnosis.drugs.agreed).map(drug => drug.id),
    )
    .flat()

  const newFinalDiagnoses = {}
  Object.values(agreedFinalDiagnoses).map(agreedFinalDiagnosis => {
    const availableDrugs = getAvailableDrugs(nodes[agreedFinalDiagnosis.id])
    const newProposed = availableDrugs.filter(
      drugId => !isDrugExcluded(drugId, agreedDrugs),
    )
    const newAgreed = JSON.parse(
      JSON.stringify(agreedFinalDiagnosis.drugs.agreed),
    )
    const drugToRemove = Object.keys(agreedFinalDiagnosis.drugs.agreed).filter(
      agreedDrugId => !newProposed.includes(parseInt(agreedDrugId)),
    )

    drugToRemove.forEach(drugId => delete newAgreed[drugId])

    newFinalDiagnoses[agreedFinalDiagnosis.id] = {
      ...agreedFinalDiagnosis,
      drugs: {
        ...agreedFinalDiagnosis.drugs,
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
