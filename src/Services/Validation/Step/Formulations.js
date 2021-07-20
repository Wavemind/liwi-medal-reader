/**
 * The internal imports
 */
import { store } from '@/Store'
import i18n from '@/Translations/index'

export default async errors => {
  const state = store.getState()
  const agreed = state.medicalCase.item.diagnosis.agreed
  const additional = state.medicalCase.item.diagnosis.additional

  let allDrugs = []

  Object.values({ ...agreed, ...additional }).forEach(diagnosis => {
    allDrugs = allDrugs
      .concat(Object.values(diagnosis.drugs.agreed).map(drug => drug))
      .concat(Object.values(diagnosis.drugs.additional).map(drug => drug))
  })

  Object.values(allDrugs).forEach(drug => {
    if (!drug.formulation_id) {
      errors[drug.id] = i18n.t('validation.formulation_required')
    }
  })

  return errors
}
