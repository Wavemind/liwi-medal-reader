import { store } from '@/Store'

/**
 * Translate algorithm value
 * @param translation
 * @returns {*}
 */
export const translate = translation => {
  const system_language = store.getState().system.language
  const type = typeof translation

  if (type === 'string') {
    return translation
  }

  // Translate given language
  if (translation.hasOwnProperty(system_language)) {
    return translation[system_language]
  }

  // Fallback in english
  if (translation.hasOwnProperty('en')) {
    return translation.en
  }

  return ''
}
