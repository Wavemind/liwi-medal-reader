/**
 * The internal imports
 */
import SetAnswer from '@/Store/MedicalCase/SetAnswer'
import UpdateMedicalHistoryQuestions from '@/Store/QuestionsPerSystem/MedicalHistory'
import UpdatePhysicalExamQuestions from '@/Store/QuestionsPerSystem/PhysicalExam'
import { store } from '@/Store/index'
import Navigation from '@/Config/Navigation'

/**
 * Wraps the setAnswer function it allows to update the question to render in Consultations Stage
 * @param {Integer} nodeId : Node we want to update
 * @param {*} value : Values we wanna set
 */
export default async (nodeId, value) => {
  const advancement = store.getState().medicalCase.item.advancement
  await store.dispatch(SetAnswer.action({ nodeId, value }))
  if (
    advancement.stage === Navigation.INTERVENTION_CONSULTATION_STAGE &&
    advancement.step === 0
  ) {
    store.dispatch(UpdateMedicalHistoryQuestions.action())
  } else if (
    advancement.stage === Navigation.INTERVENTION_CONSULTATION_STAGE &&
    advancement.step === 1
  ) {
    store.dispatch(UpdatePhysicalExamQuestions.action())
  }
}
