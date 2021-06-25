/**
 * The internal imports
 */
import { store } from '@/Store'

export default () => {
  const patientValues = store.getState().patient.item.patientValues

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
      field: 'answer',
      value: patientValue.answer_id,
    }
  })
}
