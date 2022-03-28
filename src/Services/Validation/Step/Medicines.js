/**
 * The internal imports
 */
import { store } from '@/Store'
import i18n from '@/Translations/index'
import { reworkAndOrderDrugs } from '@/Utils/Drug'

export default async errors => {
  const state = store.getState()
  const agreed = state.medicalCase.item.diagnosis.agreed
  const additional = state.medicalCase.item.diagnosis.additional
  const isArmControl = state.algorithm.item.is_arm_control

  if (!isArmControl) {
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

    const allDrugs = reworkAndOrderDrugs()
    Object.values(allDrugs)
      .flat()
      .forEach(drug => {
        if (
          ['agreed', 'additional'].includes(drug.key) &&
          !drug.selectedFormulationId
        ) {
          errors[drug.id] = i18n.t('validation.formulation_required')
        }
        if (
          ['additional', 'custom'].includes(drug.key) &&
          drug.duration === ''
        ) {
          errors[drug.id] = i18n.t('validation.duration_required')
        }
      })
  }

  return errors
}
