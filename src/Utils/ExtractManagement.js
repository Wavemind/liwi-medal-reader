/**
 * The external imports
 */
import orderBy from 'lodash/orderBy'

/**
 * The internal imports
 */
import { store } from '@/Store'

export default () => {
  const managements = {}

  const nodes = store.getState().algorithm.item.nodes
  const additional = store.getState().medicalCase.item.diagnosis.additional
  const agreed = store.getState().medicalCase.item.diagnosis.agreed

  const localDiagnoses = { additional, agreed }
  const keys = Object.keys(localDiagnoses)

  keys.forEach(diagnosisKey => {
    Object.values(localDiagnoses[diagnosisKey]).forEach(diagnosis => {
      diagnosis.managements.forEach(managementId => {
        const relatedDiagnosis = {
          id: diagnosis.id,
          diagnosisKey,
        }
        if (Object.keys(managements).indexOf(managementId.toString()) > -1) {
          managements[managementId].diagnoses.push(relatedDiagnosis)
        } else {
          managements[managementId] = {
            id: managementId,
            diagnoses: [relatedDiagnosis],
            isReferral: nodes[managementId].is_referral
          }
        }
      })
    })
  })

  return orderBy(
    Object.values(managements),
    management => nodes[management.id].level_of_urgency,
    ['desc', 'asc'],
  )
}
