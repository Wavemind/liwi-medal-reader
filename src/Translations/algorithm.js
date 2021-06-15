import i18n from '@/Translations/index'

/**
 * Translate algorithm value
 * @param translation
 * @param language
 * @returns {*}
 */
// TODO remove language parameter
export const translate = (translation, language) => {
  const type = typeof translation

  if (type === 'string') {
    return translation
  }

  // Translate given language
  if (translation.hasOwnProperty(language)) {
    return translation[language]
  }

  // Fallback in english
  if (translation.hasOwnProperty('en')) {
    return translation.en
  }

  return ''
}
