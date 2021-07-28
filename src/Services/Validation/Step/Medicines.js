/**
 * The internal imports
 */
import { store } from '@/Store'
import i18n from '@/Translations/index'

export default async errors => {
  const state = store.getState()
  const agreed = state.medicalCase.item.diagnosis.agreed
  const additional = state.medicalCase.item.diagnosis.additional
  
  let allProposedDrugs = []
  let allAgreedDrugs = []
  let allRefusedDrugs = []

  Object.values({ ...agreed, ...additional }).forEach(diagnosis => {
    allProposedDrugs = allProposedDrugs.concat(diagnosis.drugs.proposed)
    allAgreedDrugs = allAgreedDrugs.concat(
      Object.values(diagnosis.drugs.agreed).map(agreedDrug => agreedDrug.id),
    )
    allRefusedDrugs = allRefusedDrugs.concat(diagnosis.drugs.refused)
  })

  allProposedDrugs.forEach(proposedNode => {
    if (
      !(
        allRefusedDrugs.includes(proposedNode) ||
        allAgreedDrugs.includes(proposedNode)
      )
    ) {
      errors[proposedNode] = i18n.t('validation.medicines_required')
    }
  })

  return errors
}
