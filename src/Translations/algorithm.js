import { store } from '@/Store'

/**
 * Translate algorithm value
 * @param translation
 * @param fallback - Possibility to not fallback for drug instance (used in displayDrugDescription)
 * @returns {*}
 */
export const translate = (translation, fallback = true) => {
  const algorithmTranslation =
    store.getState().healthFacility.clinician.algo_language
  const type = typeof translation

  if (type === 'string') {
    return translation
  }

  // Translate given language
  if (translation.hasOwnProperty(algorithmTranslation)) {
    return translation[algorithmTranslation]
      ? translation[algorithmTranslation]
      : ''
  }

  // Fallback in english
  if (fallback && translation.hasOwnProperty('en')) {
    return translation.en
  }

  return ''
}
