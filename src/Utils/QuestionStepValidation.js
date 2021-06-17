import { store } from '@/Store'
import { Config } from '@/Config'
import { translate } from '@/Translations/algorithm'
import i18n from '@/Translations/index'

export default (questions, errors) => {
  const state = store.getState()

  const algorithm = state.algorithm.item
  const medicalCase = state.medicalCase.item

  questions.map(questionId => {
    const node = algorithm.nodes[questionId]
    const mcNode = medicalCase.nodes[questionId]
    const result = mcNode.answer !== null || mcNode.value !== ''

    // Mandatory
    if (node.is_mandatory && !result) {
      const label = translate(node.label)
      errors[questionId] = i18n.t('validation.is_required', {
        field: label,
      })
    }

    // Integer or float input out of range defined by min/max value error
    if (
      node.value_format === Config.VALUE_FORMATS.int ||
      node.value_format === Config.VALUE_FORMATS.float
    ) {
      const formattedValue = parseFloat(mcNode.value)
      if (
        mcNode.value !== null &&
        (formattedValue < node.min_value_error ||
          formattedValue > node.max_value_error)
      ) {
        // Error
        if (node.min_value_error !== null || node.max_value_error !== null) {
          if (
            formattedValue < node.min_value_error ||
            formattedValue > node.max_value_error
          ) {
            if (
              formattedValue < node.min_value_error &&
              node.min_value_error !== null
            ) {
              errors[questionId] = translate(node.min_message_error)
            }

            if (
              formattedValue > node.max_value_error &&
              node.max_value_error !== null
            ) {
              errors[questionId] = translate(node.max_message_error)
            }
          }
        }
      }
    }
  })

  return errors
}
