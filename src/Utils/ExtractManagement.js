/**
 * The external imports
 */
import orderBy from 'lodash/orderBy'

/**
 * The internal imports
 */
import { store } from '@/Store'

// TODO: RENAME FILE SAME AS SINAN FOR DRUGS
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
          diagnosisId: diagnosis.id,
          diagnosisKey,
        }
        if (Object.keys(managements).indexOf(managementId.toString()) > -1) {
          managements[managementId].relatedDiagnoses.push(relatedDiagnosis)
        } else {
          managements[managementId] = {
            id: managementId,
            relatedDiagnoses: [relatedDiagnosis],
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
