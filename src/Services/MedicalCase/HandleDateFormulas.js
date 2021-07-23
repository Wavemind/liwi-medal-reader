/**
 * The external imports
 */
import differenceInDays from 'date-fns/differenceInDays'
import differenceInMonths from 'date-fns/differenceInMonths'

/**
 * The internal imports
 */
import { store } from '@/Store'
import { handleNumeric } from '@/Utils/Answers'
import { UpdateRelatedQuestionService } from '@/Services/MedicalCase'

export default ({ birthDate, algorithm }) => {
  const {
    config: { birth_date_formulas },
    nodes,
  } = algorithm
  const state = store.getState()
  const createdAt = state.medicalCase.item.createdAt
  const mcNodes = state.medicalCase.item.nodes

  let newNodes = {}
  birth_date_formulas.forEach(nodeId => {
    let value = null
    // If user reset date of birth
    if (birthDate !== null) {
      value =
        nodes[nodeId].formula.search('Month') > 0
          ? differenceInMonths(new Date(createdAt), new Date(birthDate))
          : differenceInDays(new Date(createdAt), new Date(birthDate))
    }
    const newValue = handleNumeric(mcNodes[nodeId], nodes[nodeId], value)
    newNodes[nodeId] = { ...mcNodes[nodeId], ...newValue }
    newNodes = UpdateRelatedQuestionService({
      nodeId,
      newNodes,
      mcNodes,
    })
  })
  return { ...state.medicalCase.item, nodes: { ...mcNodes, ...newNodes } }
}
