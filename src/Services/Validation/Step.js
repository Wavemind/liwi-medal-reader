/**
 * The external imports
 */

/**
 * The internal imports
 */
import { store } from '@/Store'
import { getStages } from '@/Utils/Navigation/GetStages'

export default () => {
  const medicalCase = store.getState().medicalCase.item
  const algorithm = store.getState().algorithm.item
  const navigation = getStages()
  const step = medicalCase.advancement.step
  const stage = medicalCase.advancement.stage

  console.log(navigation[stage].steps[step])

  const Errors = []

  switch (navigation[stage].steps[step].label) {
    case 'registration':
      const questions = algorithm.config.full_order.registration_step

      questions.map(questionId => {
        const node = algorithm.nodes[questionId]
        const mcNode = medicalCase.nodes[questionId]
        console.log(questionId, mcNode.answer, mcNode.value)
        if (node.is_mandatory) {
          Errors.push({ id: questionId, message: "c'est obligatoire connard" })
        }
      })

      return Errors
      return
    default:
      return 'dommage'
  }
}
