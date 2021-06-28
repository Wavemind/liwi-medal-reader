/**
 * The internal imports
 */
import { store } from '@/Store'
import { getStages } from '@/Utils/Navigation/GetStages'
import { QuestionStepValidation } from '@/Utils'
import RegistrationStepService from '@/Services/Validation/Step/Registration'
import {
  BasicMeasurementQuestions,
  UniqueTriageQuestions,
  MedicalHistoryQuestions,
  PhysicalExamQuestions,
  AssessmentQuestions,
  ReferralQuestions,
  TreatmentConditionsQuestions,
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
  return {}
  switch (navigation[stage].steps[step].label) {
    case 'registration':
      return RegistrationStepService(errors)
    case 'unique_triage_questions':
      return QuestionStepValidation(UniqueTriageQuestions(), errors)
    case 'complaint_categories':
      return {}
    case 'basic_measurements':
      return QuestionStepValidation(BasicMeasurementQuestions(), errors)
    case 'medical_history':
      systems = MedicalHistoryQuestions()
      systems.forEach(system => {
        questions = questions.concat(system.data)
      })
      return QuestionStepValidation(questions, errors)
    case 'physical_exams':
      systems = PhysicalExamQuestions()
      systems.forEach(system => {
        questions = questions.concat(system.data)
      })
      return QuestionStepValidation(questions, errors)
    case 'assessments':
      return QuestionStepValidation(AssessmentQuestions(), errors)
    case 'final_diagnoses':
      return {}
    case 'healthcare_questions':
      return QuestionStepValidation(TreatmentConditionsQuestions(), errors)
    case 'medicines':
      return {}
    case 'formulations':
      return {}
    case 'summary':
      return {}
    case 'referral':
      if (algorithm.config.track_referral) {
        return QuestionStepValidation(ReferralQuestions(), errors)
      }
      return {}
    default:
      return {}
  }
}
