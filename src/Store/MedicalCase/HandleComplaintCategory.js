import { createAction } from '@reduxjs/toolkit'
import differenceInDays from 'date-fns/differenceInDays'
import { getNoAnswer, getYesAnswer } from '@/Utils/Answers'
export default {
  initialState: {},
  action: createAction('medicalCase/handleComplaintCategory'),
  reducers(state, { payload: { birthDate, algorithm } }) {
    const mcNodes = state.item.nodes
    console.log(algorithm)

    const olderCC = algorithm.config.full_order.complaint_categories_step.older

    const neonatCC =
      algorithm.config.full_order.complaint_categories_step.neonat

    const olderGeneralId = algorithm.config.basic_questions.general_cc_id
    const neonatGeneralId = algorithm.config.basic_questions.yi_general_cc_id

    const days = differenceInDays(
      new Date(state.item.createdAt),
      new Date(birthDate),
    )

    if (days <= 60) {
      olderCC.forEach(ccId => {
        mcNodes[ccId].answer = getNoAnswer(algorithm.nodes[ccId]).id
      })
      mcNodes[neonatGeneralId].answer = getYesAnswer(
        algorithm.nodes[neonatGeneralId],
      ).id
    } else {
      neonatCC.forEach(ccId => {
        mcNodes[ccId].answer = getNoAnswer(algorithm.nodes[ccId]).id
      })
      mcNodes[olderGeneralId].answer = getYesAnswer(
        algorithm.nodes[olderGeneralId],
      ).id
    }
    console.log({ ...mcNodes })
    return {
      ...state,
      nodes: mcNodes,
    }
  },
}
