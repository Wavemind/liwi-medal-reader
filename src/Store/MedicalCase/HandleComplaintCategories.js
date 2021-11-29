/**
 * The external imports
 */
import { createAction } from '@reduxjs/toolkit'
import differenceInDays from 'date-fns/differenceInDays'

/**
 * The internal imports
 */
import { getNoAnswer, getYesAnswer } from '@/Utils/Answers'

export default {
  initialState: {},
  action: createAction('medicalCase/handleComplaintCategories'),
  reducers(state, { payload: { birthDate, algorithm } }) {
    const {
      config: { full_order, basic_questions },
      nodes,
    } = algorithm

    const olderCC = full_order.complaint_categories_step.older
    const neonatCC = full_order.complaint_categories_step.neonat

    const olderGeneralId = basic_questions.general_cc_id
    const neonatGeneralId = basic_questions.yi_general_cc_id

    const days = differenceInDays(
      new Date(state.item.createdAt),
      new Date(birthDate),
    )

    if (days <= 59) {
      olderCC.forEach(ccId => {
        state.item.nodes[ccId].answer = getNoAnswer(nodes[ccId]).id
      })
      state.item.nodes[neonatGeneralId].answer = getYesAnswer(
        nodes[neonatGeneralId],
      ).id
    } else {
      neonatCC.forEach(ccId => {
        state.item.nodes[ccId].answer = getNoAnswer(nodes[ccId]).id
      })
      state.item.nodes[olderGeneralId].answer = getYesAnswer(
        nodes[olderGeneralId],
      ).id
    }

    return state
  },
}
