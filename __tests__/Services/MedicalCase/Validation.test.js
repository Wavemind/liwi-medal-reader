/**
 * The external imports
 */
import 'react-native'

/**
 * The internal imports
 */
import QuestionValidationService from '@/Services/Validation/Question'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import { translate } from '@/Translations/algorithm'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import { store } from '@/Store'

beforeAll(async () => {
  const algorithmFile = require('../../algorithm.json')
  await store.dispatch(
    LoadAlgorithm.action({
      newAlgorithm: algorithmFile,
    }),
  )
  const algorithm = store.getState().algorithm.item
  await store.dispatch(CreateMedicalCase.action({ algorithm }))
})

describe('Handle validations message', () => {
  it('should not have error', async () => {
    const algorithm = store.getState().algorithm.item
    const medicalCase = store.getState().medicalCase.item

    // Axillary temperature (in XX.X °C)
    const node = algorithm.nodes[50]
    const mcNode = medicalCase.nodes[50]

    // Value to 37.7°
    const result = await QuestionValidationService(mcNode, node, '37.7')
    expect(result).toStrictEqual({
      validationMessage: null,
      validationType: null,
    })
  })

  it('should handle error message without warning message filled in node', async () => {
    const algorithm = store.getState().algorithm.item
    const medicalCase = store.getState().medicalCase.item

    // Axillary temperature (in XX.X °C)
    const node = algorithm.nodes[50]
    const mcNode = medicalCase.nodes[50]

    // Value to 63°
    const result = await QuestionValidationService(mcNode, node, '63')
    expect(result).toStrictEqual({
      validationMessage: translate(node.max_message_error),
      validationType: 'error',
    })
  })

  it('should avoid validation if an unavailableValue is set', async () => {
    const algorithm = store.getState().algorithm.item
    const medicalCase = store.getState().medicalCase.item

    // Axillary temperature (in XX.X °C)
    const node = algorithm.nodes[50]
    const mcNode = medicalCase.nodes[50]
    mcNode.unavailableValue = true

    // Child feels hot = 38°
    const result = await QuestionValidationService(
      mcNode,
      node,
      Object.values(node.answers)[0].value,
    )
    expect(result).toStrictEqual({
      validationMessage: null,
      validationType: null,
    })
  })
})
