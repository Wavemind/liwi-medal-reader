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

export default () => {
  const state = store.getState()

  const medicalCase = state.medicalCase.item
  const algorithm = state.algorithm.item

  const navigation = getStages()
  const step = medicalCase.advancement.step
  const stage = medicalCase.advancement.stage
  console.log(navigation)
  console.log(navigation[stage].steps[step])

  let errors = {}
  let questions = []

  switch (navigation[stage].steps[step].label) {
    case 'registration':
      return RegistrationStepService(errors)
    case 'unique_triage_questions':
      questions = algorithm.config.full_order.first_look_assessment_step
      return QuestionStepValidation(questions, errors)
    case 'complaint_categories':
      return {}
    case 'basic_measurements':
      return QuestionStepValidation(errors)
    case 'medical_history':
      return QuestionStepValidation(errors)
    case 'physical_exams':
      return QuestionStepValidation(errors)
    case 'assessments':
      return QuestionStepValidation(errors)
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
      return QuestionStepValidation(errors)
    default:
      return {}
  }
}
