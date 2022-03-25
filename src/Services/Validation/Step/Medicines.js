/**
 * The internal imports
 */
import { store } from '@/Store'
import i18n from '@/Translations/index'

export default async errors => {
  const state = store.getState()
  const agreed = state.medicalCase.item.diagnosis.agreed
  const additional = state.medicalCase.item.diagnosis.additional
  const custom = state.medicalCase.item.diagnosis.custom
  const isArmControl = state.algorithm.item.is_arm_control

  if (!isArmControl) {
    let allProposedDrugs = []
    let allAgreedDrugs = []
    let allRefusedDrugs = []
    let allCustomDrugs = []
    let allDrugs = []

    Object.values({ ...agreed, ...additional }).forEach(diagnosis => {
      allProposedDrugs = allProposedDrugs.concat(diagnosis.drugs.proposed)
      allAgreedDrugs = allAgreedDrugs.concat(
        Object.values(diagnosis.drugs.agreed).map(agreedDrug => agreedDrug.id),
      )
      allRefusedDrugs = allRefusedDrugs.concat(diagnosis.drugs.refused)
      allCustomDrugs = allCustomDrugs.concat(
        Object.values(diagnosis.drugs.custom).map(customDrug => customDrug.id),
      )
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

    Object.values({ ...agreed, ...additional }).forEach(diagnosis => {
      allDrugs = allDrugs
        .concat(Object.values(diagnosis.drugs.agreed).map(drug => drug))
        .concat(Object.values(diagnosis.drugs.additional).map(drug => drug))
    })

    allDrugs.forEach(drug => {
      if (!drug.formulation_id) {
        errors[drug.id] = i18n.t('validation.formulation_required')
      }
    })
  }

  return errors
}
