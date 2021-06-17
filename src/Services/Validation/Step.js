/**
 * The external imports
 */

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
} from '@/Services/Steps'

export default () => {
  const state = store.getState()

  const medicalCase = state.medicalCase.item

  const navigation = getStages()
  const step = medicalCase.advancement.step
  const stage = medicalCase.advancement.stage
  console.log(navigation)
  console.log(navigation[stage].steps[step])

  let errors = {}

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
      return QuestionStepValidation(errors)
    case 'physical_exams':
      return QuestionStepValidation(errors)
    case 'assessments':
      return QuestionStepValidation(AssessmentQuestions(), errors)
    case 'final_diagnoses':
      return {}
    case 'healthcare_questions':
      return QuestionStepValidation(errors)
    case 'medicines':
      return {}
    case 'formulations':
      return {}
    case 'summary':
      return {}
    case 'referral':
      return QuestionStepValidation(ReferralQuestions(), errors)
    default:
      return {}
  }
}
