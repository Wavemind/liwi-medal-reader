/**
 * Get yes answer based on reference
 * @param node - (algorithm or medical case node)
 */
export const getYesAnswer = node => {
  const { answers } = node

  const yesAnswerIndex = Object.keys(answers).findIndex(answerId => {
    const { reference } = answers[answerId]
    return reference === 1
  })

  return Object.values(answers)[yesAnswerIndex]
}

/**
 * Get no answer based on reference
 * @param node - (algorithm or medical case node)
 */
export const getNoAnswer = node => {
  const { answers } = node

  const noAnswerIndex = Object.keys(answers).findIndex(answerId => {
    const { reference } = answers[answerId]
    return reference === 2
  })

  return Object.values(answers)[noAnswerIndex]
}
