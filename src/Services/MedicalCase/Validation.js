/**
 * The external imports
 */
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { Config } from '@/Config'
import { translate } from '@/Translations/algorithm'

export default async (mcNode, value) => {
  // Get value from store
  const algorithm = useSelector(state => state.algorithm.item)
  const currentNode = algorithm.nodes[mcNode.id]

  console.log(mcNode, currentNode)

  // Default validations value
  let message = ''
  let type = ''

  // Skip validation algorithm is in arm control except in registration
  if (
    algorithm.is_arm_control &&
    !algorithm.mobile_config.questions_order.registration.includes(mcNode.id)
  ) {
    return { message, type }
  }

  // Skip validation if answer is set as unavailable
  if (!mcNode.unavailableValue) {
    return { message, type }
  }

  // Validate only integer and float questions
  if (
    currentNode.value_format === Config.VALUE_FORMATS.int ||
    currentNode.value_format === Config.VALUE_FORMATS.float
  ) {
    if (
      value !== null &&
      (value < currentNode.min_value_warning ||
        value > currentNode.max_value_warning)
    ) {
      // Warning
      if (
        value < currentNode.min_value_warning &&
        currentNode.min_value_warning !== null
      ) {
        message = currentNode.min_message_warning
      }

      if (
        value > currentNode.max_value_warning &&
        currentNode.max_value_warning !== null
      ) {
        message = currentNode.max_message_warning
      }

      type = 'warning'

      // Error
      if (
        currentNode.min_value_error !== null ||
        currentNode.max_value_error !== null
      ) {
        if (
          value < currentNode.min_value_error ||
          value > currentNode.max_value_error
        ) {
          if (
            value < currentNode.min_value_error &&
            currentNode.min_value_error !== null
          ) {
            message = currentNode.min_message_error
          }

          if (
            value > currentNode.max_value_error &&
            currentNode.max_value_error !== null
          ) {
            message = currentNode.max_message_error
          }
          type = 'error'
        }
      }
      return {
        message: translate(message),
        type,
      }
    }
  }

  return { message, type }
}
