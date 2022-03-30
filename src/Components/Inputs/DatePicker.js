/**
 * The external imports
 */
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { TextInput, TouchableOpacity } from 'react-native'
import * as RNDatePicker from 'react-native-date-picker'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import setAnswer from '@/Utils/SetAnswer'
import { translate } from '@/Translations/algorithm'
import { formatDate } from '@/Utils/Date'

const DatePicker = ({ questionId, editable = true }) => {
  // Theme and style elements deconstruction
  const {
    Components: { string },
  } = useTheme()

  const { t } = useTranslation()

  const question = useSelector(
    state => state.medicalCase.item.nodes[questionId],
  )
  const currentNode = useSelector(
    state => state.algorithm.item.nodes[questionId],
  )
  const systemLanguage = useSelector(
    state => state.healthFacility.clinician.app_language,
  )

  // Local state definition
  const [dateLanguage] = useState(systemLanguage)
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(
    question.value ? new Date(question.value) : null,
  )

  /**
   * Save value in store
   * @param {Date} newDate
   */
  const handleConfirm = newDate => {
    setOpen(false)
    if (question.value !== newDate) {
      setDate(newDate)
      setAnswer(question.id, newDate.getTime())
    }
  }

  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)}>
        <TextInput
          style={string.input(true)}
          value={date ? formatDate(date) : ''}
          editable={false}
          placeholder={
            currentNode.placeholder && translate(currentNode.placeholder)
          }
          pointerEvents="none"
        />
      </TouchableOpacity>
      <RNDatePicker
        modal
        mode="date"
        open={open}
        date={date ? date : new Date()}
        onConfirm={newDate => handleConfirm(newDate)}
        onCancel={() => setOpen(false)}
        locale={dateLanguage}
        title={t('components.date.title')}
        confirmText={t('components.date.confirm')}
        cancelText={t('components.date.cancel')}
      />
    </>
  )
}

export default DatePicker
