import { store } from '@/Store'

/**
 * Translate algorithm value
 * @param translation
 * @returns {*}
 */
export const translate = translation => {
  const algorithmTranslation = store.getState().algorithm.language
  const type = typeof translation

  if (type === 'string') {
    return translation
  }

  // Translate given language
  if (translation.hasOwnProperty(algorithmTranslation)) {
    return translation[algorithmTranslation]
  }

  // Fallback in english
  if (translation.hasOwnProperty('en')) {
    return translation.en
  }

  return ''
}
