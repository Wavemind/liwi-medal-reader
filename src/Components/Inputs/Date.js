/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { TextInput } from 'react-native'
import { useSelector } from 'react-redux'
import DatePicker from 'react-native-date-picker'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import setAnswer from '@/Utils/SetAnswer'
import { translate } from '@/Translations/algorithm'
import { displayResult } from '@/Utils/ReferenceTable'
import { Config } from '@/Config'

const DateInput = ({ questionId, editable = true }) => {
  // Theme and style elements deconstruction
  const {
    Components: { string },
  } = useTheme()

  const question = useSelector(
    state => state.medicalCase.item.nodes[questionId],
  )
  const currentNode = useSelector(
    state => state.algorithm.item.nodes[questionId],
  )

  // Local state definition
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // if (question.value === null) {
    //   setValue('')
    // } else if (currentNode.display_format === Config.DISPLAY_FORMAT.reference) {
    //   setValue(displayResult(question.value, questionId))
    // } else {
    //   setValue(question.value.toString())
    // }
  }, [question.value])

  /**
   * Save value in store
   * @param {Date} newDate
   */
  const handleConfirm = newDate => {
    if (question.value !== newDate) {
      setAnswer(question.id, newDate)
    }
  }

  return (
    <DatePicker
      modal
      mode="date"
      open={open}
      date={question.value}
      onConfirm={newDate => handleConfirm(newDate)}
      onCancel={() => setOpen(false)}
      locale="fr"
      title="Put your title here"
      confirmText="Put your confirm text here"
      cancelText="Put your cancel text here"
    />
  )
}

export default DateInput
