/**
 * The internal imports
 */
import { store } from '@/Store'
import i18n from '@/Translations/index'

export default async errors => {
  const state = store.getState()
  const proposed = state.medicalCase.item.diagnosis.proposed
  const agreed = state.medicalCase.item.diagnosis.agreed
  const refused = state.medicalCase.item.diagnosis.refused

  const agreedIds = Object.values(agreed).map(agreedNode => agreedNode.id)

  proposed.forEach(proposedNode => {
    if (!(refused.includes(proposedNode) || agreedIds.includes(proposedNode))) {
      errors[proposedNode] = i18n.t('validation.final_diagnoses_required')
    }
  })

  return errors
}
