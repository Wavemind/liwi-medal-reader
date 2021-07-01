/**
 * The internal imports
 */
import SetAnswer from '@/Store/MedicalCase/SetAnswer'
import UpdateMedicalHistoryQuestions from '@/Store/QuestionsPerSystem/MedicalHistory'
import UpdatePhysicalExamQuestions from '@/Store/QuestionsPerSystem/PhysicalExam'
import { ARM_CONTROL_ASSESSMENT_STAGE } from '@/Config/Navigation'
import { store } from '@/Store/index'

/**
 * Wraps the setAnswer function it allows to update the question to render in Consultations Stage
 * @param {Integer} nodeId : Node we want to update
 * @param {*} value : Values we wanna set
 */
export default async (nodeId, value) => {
  const advancement = store.getState().medicalCase.item.advancement
  await store.dispatch(SetAnswer.action({ nodeId, value }))
  if (
    advancement.stage === ARM_CONTROL_ASSESSMENT_STAGE &&
    advancement.step === 0
  ) {
    store.dispatch(UpdateMedicalHistoryQuestions.action())
  } else if (
    advancement.stage === ARM_CONTROL_ASSESSMENT_STAGE &&
    advancement.step === 1
  ) {
    store.dispatch(UpdatePhysicalExamQuestions.action())
  }
}
