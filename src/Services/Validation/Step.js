/**
 * The internal imports
 */
import { store } from '@/Store'
import { getStages } from '@/Utils/Navigation/GetStages'
import { QuestionStepValidation } from '@/Utils'
import { RegistrationStepService } from '@/Services/Validation'
import {
  BasicMeasurementQuestionsService,
  UniqueTriageQuestionsService,
  MedicalHistoryQuestionsService,
  PhysicalExamQuestionsService,
  AssessmentQuestionsService,
  ReferralQuestionsService,
  TreatmentConditionsQuestionsService,
} from '@/Services/Steps'

export default () => {
  const state = store.getState()

  const medicalCase = state.medicalCase.item
  const algorithm = state.algorithm.item

  const navigation = getStages()
  const step = medicalCase.advancement.step
  const stage = medicalCase.advancement.stage

  let errors = {}
  let questions = []
  let systems = []

  switch (navigation[stage].steps[step].label) {
    case 'registration':
      return RegistrationStepService(errors)
    case 'unique_triage_questions':
      return QuestionStepValidation(UniqueTriageQuestionsService(), errors)
    case 'complaint_categories':
      return {}
    case 'basic_measurements':
      return QuestionStepValidation(BasicMeasurementQuestionsService(), errors)
    case 'medical_history':
      systems = MedicalHistoryQuestionsService()
      Object.values(systems.medicalHistory).forEach(system => {
        questions = questions.concat(system)
      })
      return QuestionStepValidation(questions, errors)
    case 'physical_exams':
      systems = PhysicalExamQuestionsService()
      Object.values(systems.physicalExam).forEach(system => {
        questions = questions.concat(system)
      })
      return QuestionStepValidation(questions, errors)
    case 'assessments':
      return QuestionStepValidation(AssessmentQuestionsService(), errors)
    case 'final_diagnoses':
      return {}
    case 'healthcare_questions':
      return QuestionStepValidation(
        TreatmentConditionsQuestionsService(),
        errors,
      )
    case 'medicines':
      return {}
    case 'formulations':
      return {}
    case 'summary':
      return {}
    case 'referral':
      if (algorithm.config.track_referral) {
        return QuestionStepValidation(ReferralQuestionsService(), errors, true)
      }
      return {}
    default:
      return {}
  }
}
