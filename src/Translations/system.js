import { store } from '@/Store'

/**
 * Translate system value
 * @param translation
 * @returns {String}
 */
export const translate = translation => {
  const systemTranslation =
    store.getState().healthFacility.clinician.app_language
  const type = typeof translation

  if (type === 'string') {
    return translation
  }

  // Translate given language
  if (translation.hasOwnProperty(systemTranslation)) {
    return translation[systemTranslation] ? translation[systemTranslation] : ''
  }

  // Fallback in english
  if (translation.hasOwnProperty('EN')) {
    return translation.EN
  }

  return ''
}
