/**
 * The external imports
 */
import differenceInDays from 'date-fns/differenceInDays'

/**
 * The internal imports
 */
import { store } from '@/Store'
import { calculateConditionInverse } from '@/Utils/MedicalCase'

export default () => {
  const state = store.getState()
  const { full_order, basic_questions } = state.algorithm.item.config

  // Get CC order (older and neot) and general cc id for neonat and general
  const birthDate = state.patient.item.birth_date
  const createdAt = state.medicalCase.item.createdAt
  const olderCC = full_order.complaint_categories_step.older
  const neonatCC = full_order.complaint_categories_step.neonat
  const olderGeneralId = basic_questions.general_cc_id
  const neonatGeneralId = basic_questions.yi_general_cc_id
  const instances = state.algorithm.item.diagram.instances
  const mcNodes = state.medicalCase.item.nodes

  const days = differenceInDays(new Date(createdAt), new Date(birthDate))

  if (days <= 59) {
    return neonatCC.filter(
      nodeId =>
        nodeId !== neonatGeneralId &&
        calculateConditionInverse(instances[nodeId]?.conditions, mcNodes),
    )
  } else {
    return olderCC.filter(
      nodeId =>
        nodeId !== olderGeneralId &&
        calculateConditionInverse(instances[nodeId]?.conditions, mcNodes),
    )
  }
}
