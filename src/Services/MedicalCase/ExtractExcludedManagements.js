import { store } from '@/Store'
import { uniq } from '@/Utils/MedicalCase'

/**
 * Extracts the excluded managements from the agreed and additional diagnoses
 * @returns {[]}
 */
export default () => {
  const { agreed, additional } = store.getState().medicalCase.item.diagnosis
  const nodes = store.getState().algorithm.item.nodes

  const allManagements = []
  Object.values({ ...agreed, ...additional }).forEach(({ managements }) => {
    allManagements.push(...managements)
  })

  const excludedManagements = []
  allManagements.forEach(managementId => {
    if (nodes[managementId].excluding_nodes_ids.length > 0) {
      nodes[managementId].excluding_nodes_ids.forEach(excludingId => {
        if (allManagements.indexOf(excludingId) > -1) {
          excludedManagements.push(managementId)
        }
      })
    }
  })
  return uniq(excludedManagements)
}
