/**
 * The external imports
 */
import uuid from 'react-native-uuid'

/**
 * The internal imports
 */
import CreatePatient from '@/Store/Patient/Create'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import { store } from '@/Store'
import { setBirthDate } from '../../Utils/BirthDate'
import { setAnswer } from '../../Utils/Answer'

beforeAll(async () => {
  const algorithmFile = require('../../algorithm.json')
  await store.dispatch(
    LoadAlgorithm.action({
      newAlgorithm: algorithmFile,
    }),
  )
})

beforeEach(async () => {
  const algorithm = store.getState().algorithm.item
  await store.dispatch(CreateMedicalCase.action({ algorithm }))
  const uid = uuid.v4()
  await store.dispatch(
    CreatePatient.action({
      facility: {
        uid,
        study_id: 'Test Study',
        group_id: 7,
      },
      otherFacility: {},
    }),
  )
})

describe('Handle validations message', () => {
  it('Should return -1 form the MUAC Z-score', async () => {
    await setBirthDate(store, 129, 'month')
    await setAnswer(214, 393) // I'm a female
    await setAnswer(97, 16.9) // my Muac 16.9 cm
    const mcNodes = store.getState().medicalCase.item.nodes
    expect(mcNodes[99].value).toEqual(-1)
  })
  it('Should update date formulas on set Birthday', async () => {
    await setBirthDate(store, 129)
    const mcNodes = store.getState().medicalCase.item.nodes
    expect(mcNodes[2].value).toEqual(128)
  })
  it('Rounding above when below 0 - Should return 0 on weight for height', async () => {
    await setAnswer(214, 394) // I'm a male
    await setAnswer(2096, 66.4) // Height
    await setAnswer(3, 7.3) // Weight

    const mcNodes = store.getState().medicalCase.item.nodes
    expect(mcNodes[2101].value).toEqual(0)
  })

  it('Rounding below when above 0 - Should return 0 on weight for height higher scope', async () => {
    await setAnswer(214, 394) // I'm a male
    await setAnswer(2096, 66.4) // Height
    await setAnswer(3, 7.9) // Weight

    const mcNodes = store.getState().medicalCase.item.nodes
    expect(mcNodes[2101].value).toEqual(0)
  })

  it('Should return -3 when the value is way to low on weight for height', async () => {
    await setAnswer(214, 393) // I'm a female
    await setAnswer(2096, 47) // Height
    await setAnswer(3, 2) // Weight

    const mcNodes = store.getState().medicalCase.item.nodes
    expect(mcNodes[2101].value).toEqual(-3)
  })

  it('Should return 3 when the value is way to heigh on weight for height', async () => {
    await setAnswer(214, 393) // I'm a female
    await setAnswer(2096, 47) // Height
    await setAnswer(3, 5) // Weight

    const mcNodes = store.getState().medicalCase.item.nodes
    expect(mcNodes[2101].value).toEqual(3)
  })
})
