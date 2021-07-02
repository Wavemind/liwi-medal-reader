import { store } from '@/Store'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import AddStepActivities from '@/Store/MedicalCase/AddStepActivities'

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

describe('Handle activities step addition', () => {
  it('should add a new step for activities', () => {
    const stepActivities = {
      stage: 'registration',
      step: 'registration',
      questions: [],
    }
    store.dispatch(AddStepActivities.action({ stepActivities }))

    expect(store.getState().medicalCase.item.activities.length).toBe(1)
  })

  it('should have an empty questions array', () => {
    const stepActivities = {
      stage: 'registration',
      step: 'registration',
      questions: [],
    }
    store.dispatch(AddStepActivities.action({ stepActivities }))

    expect(
      store.getState().medicalCase.item.activities[0].questions.length,
    ).toBe(0)
  })

  it('should have the correct structure', async () => {
    const stepActivities = {
      stage: 'registration',
      step: 'registration',
      questions: [],
    }
    store.dispatch(AddStepActivities.action({ stepActivities }))

    expect(store.getState().medicalCase.item.activities[0]).toStrictEqual({
      stage: 'registration',
      step: 'registration',
      questions: [],
    })
  })
})
