/**
 * The external imports
 */
import find from 'lodash/find'

/**
 * The internal imports
 */
import { store } from '@/Store'
import { Config } from '@/Config'
import { translate } from '@/Translations/algorithm'
import i18n from '@/Translations/index'

export default (questions, errors, validateInArmControl = false) => {
  const state = store.getState()

  const algorithm = state.algorithm.item
  const medicalCase = state.medicalCase.item

  questions.map(questionId => {
    const node = algorithm.nodes[questionId]
    const mcNode = medicalCase.nodes[questionId]

    const unavailableAnswer = find(
      node.answers,
      a => a.value === 'not_available',
    )

    if (
      (!mcNode.unavailableValue && mcNode.value !== unavailableAnswer?.id) ||
      (mcNode.unavailableValue && mcNode.answer === null)
    ) {
      const result =
        mcNode.answer !== null || (mcNode.value !== '' && mcNode.value !== null)

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

      // Skip validation if algorithm is in arm control except for registration and referral
      if (
        !algorithm.is_arm_control ||
        (algorithm.is_arm_control && validateInArmControl)
      ) {
        // Mandatory
        if (node.is_mandatory && !result) {
          const label = translate(node.label)
          errors[questionId] = i18n.t('validation.is_required', {
            field: label,
            interpolation: { escapeValue: false },
          })
        }
      }
    }
  })

  return errors
}
