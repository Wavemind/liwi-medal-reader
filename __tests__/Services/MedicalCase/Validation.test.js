/**
 * The external imports
 */
import 'react-native'

/**
 * The internal imports
 */
import validationMedicalCaseService from '@/Services/MedicalCase/Validation'
import createMedicalCaseService from '@/Services/MedicalCase/Create'
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
  await createMedicalCaseService({ algorithm })
})

describe('Handle error message', () => {
  it('should handle error message without warning message filled in node', async () => {
    const algorithm = store.getState().algorithm.item
    const medicalCase = store.getState().medicalCase.item

    // Axillary temperature (in XX.X °C)
    const node = algorithm.nodes[50]
    const mcNode = medicalCase.nodes[50]

    const result = await validationMedicalCaseService(mcNode, node, 63)
    expect(result).toStrictEqual({
      validationMessage: translate(node.max_message_error),
      validationType: 'error',
    })
  })
})
