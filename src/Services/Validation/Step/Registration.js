/**
 * The internal imports
 */
import { store } from '@/Store'

import i18n from '@/Translations/index'
import { QuestionStepValidation } from '@/Utils'
import { RegistrationQuestionsService } from '@/Services/Steps'

export default async errors => {
  const state = store.getState()

  const algorithm = state.algorithm.item
  const patient = state.patient.item

  const questions = RegistrationQuestionsService().filter(
    question => typeof question === 'number',
  )
  const consentManagement = algorithm.config.consent_management

  // Consent management
  if (
    consentManagement &&
    (!patient.consent ||
      patient.consent === null ||
      (patient.consent && patient.consent_file === null))
  ) {
    errors.consent = i18n.t('validation.consent_file_blank')
  }

  // First name, last name
  const staticValues = ['first_name', 'last_name']
  staticValues.forEach(element => {
    if (patient[element] === '') {
      errors[element] = i18n.t('validation.is_required', {
        field: i18n.t(`patient.${element}`),
      })
    }
  })

  // Birth date
  if (isNaN(patient.birth_date)) {
    errors.birth_date = i18n.t('validation.is_required', {
      field: i18n.t('patient.birth_date'),
    })
  }

  // Questions
  errors = QuestionStepValidation(questions, errors, true)

  return errors
}
