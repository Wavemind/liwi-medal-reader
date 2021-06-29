import { store } from '@/Store'

/**
 * Translate algorithm value
 * @param translation
 * @returns {*}
 */
export const translate = translation => {
  const algorithm_language = store.getState().algorithm.language
  const type = typeof translation

  if (type === 'string') {
    return translation
  }

  // Translate given language
  if (translation.hasOwnProperty(algorithm_language)) {
    return translation[algorithm_language]
  }

  // Fallback in english
  if (translation.hasOwnProperty('en')) {
    return translation.en
  }

  return ''
}
