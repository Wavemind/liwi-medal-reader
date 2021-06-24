/**
 * The internal imports
 */
import { store } from '@/Store'

export default () => {
  // TODO the issue is most likely something to do with age in days
  // TODO Ask the question "Why is Age in Days not being saved in patient values"
  const medicalCase = store.getState().medicalCase.item
  const patientValues = store.getState().patient.item.patientValues
  const algorithm = store.getState().algorithm.item.nodes
  console.log(algorithm)
  console.log(patientValues)

  return patientValues.map(patientValue => {
    if (patientValue.answer_id === null) {
      return {
        nodeId: patientValue.node_id,
        field: 'value',
        value: patientValue.value,
      }
    }
    return {
      nodeId: patientValue.node_id,
      field: 'answer_id',
      value: patientValue.answer_id,
    }
  })
}
