/**
 * The internal imports
 */
import { UpdateQuestionSequenceService } from '@/Services/MedicalCase'
import { QuestionValidationService } from '@/Services/Validation'
import { uniq } from '@/Utils/MedicalCase'
import { handleNumeric } from '@/Utils/Answers'
import { calculateFormula } from '@/Utils/Formula'
import { calculateReference } from '@/Utils/ReferenceTable'
import { store } from '@/Store'
import { Config } from '@/Config'

export default ({ nodeId, newNodes }) => {
  const state = store.getState()
  const nodes = state.algorithm.item.nodes
  const mcNodes = state.medicalCase.item.nodes

  // List of formulas/reference tables we need to update
  let questionsToUpdate = nodes[nodeId].referenced_in

  while (questionsToUpdate.length > 0) {
    const questionId = questionsToUpdate[0]
    const node = nodes[questionId]
    const mcNode = mcNodes[questionId]

    let value = null

    if (node.display_format === Config.DISPLAY_FORMAT.formula) {
      value = calculateFormula(questionId, newNodes)
    } else {
      value = calculateReference(questionId, newNodes)
    }

    if (value !== null) {
      const validation = QuestionValidationService(mcNode, node, value)

      if (validation.validationType === 'error') {
        newNodes[node.id] = {
          ...mcNode,
          ...validation,
        }
      } else {
        const newQuestionValues = handleNumeric(mcNode, node, value)
        // Set the question value in the store
        newNodes[questionId] = { ...newNodes[questionId], ...newQuestionValues }
      }
      questionsToUpdate = questionsToUpdate.concat(node.referenced_in)

      // uniq to avoid processing same question multiple time
      // Slice to remove element we just handled
      newNodes = UpdateQuestionSequenceService({ nodeId: questionId, newNodes })
    }
    questionsToUpdate = uniq(questionsToUpdate.slice(1))
  }
  return newNodes
}
