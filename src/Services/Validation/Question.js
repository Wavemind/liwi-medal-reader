/**
 * The external imports
 */
import find from 'lodash/find'

/**
 * The internal imports
 */
import { Config } from '@/Config'
import { translate } from '@/Translations/algorithm'
import { RegistrationQuestions } from '@/Services/Steps'
import { store } from '@/Store'

export default (mcNode, node, value) => {
  const { algorithm } = store.getState()

  const formattedValue = parseFloat(value)
  const unavailableAnswer = find(node.answers, a => a.value === 'not_available')

  // Default validations value
  let validationMessage = null
  let validationType = null

  // Skip validation algorithm is in arm control except in registration
  if (
    algorithm.is_arm_control &&
    !RegistrationQuestions().includes(mcNode.id)
  ) {
    return { validationMessage, validationType }
  }

  // Skip validation if answer is set as unavailable
  if (mcNode.unavailableValue || value === unavailableAnswer?.id) {
    return { validationMessage, validationType }
  }

  // Validate only integer and float questions
  if (
    node.value_format === Config.VALUE_FORMATS.int ||
    node.value_format === Config.VALUE_FORMATS.float
  ) {
    if (
      value !== null &&
      (formattedValue < node.min_value_warning ||
        formattedValue > node.max_value_warning ||
        formattedValue < node.min_value_error ||
        formattedValue > node.max_value_error)
    ) {
      // Warning
      if (
        formattedValue < node.min_value_warning &&
        node.min_value_warning !== null
      ) {
        validationMessage = node.min_message_warning
      }

      if (
        formattedValue > node.max_value_warning &&
        node.max_value_warning !== null
      ) {
        validationMessage = node.max_message_warning
      }

      validationType = 'warning'

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
            validationMessage = node.min_message_error
          }

          if (
            formattedValue > node.max_value_error &&
            node.max_value_error !== null
          ) {
            validationMessage = node.max_message_error
          }
          validationType = 'error'
        }
      }
      return {
        validationMessage: translate(validationMessage),
        validationType,
      }
    }
  }

  return { validationMessage, validationType }
}
