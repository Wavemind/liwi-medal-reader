/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { TextInput, TouchableOpacity } from 'react-native'
import DatePicker from 'react-native-date-picker'
import getUnixTime from 'date-fns/getUnixTime'
import fromUnixTime from 'date-fns/fromUnixTime'
import fr from 'date-fns/locale/fr'
import enGB from 'date-fns/locale/en-GB'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import setAnswer from '@/Utils/SetAnswer'
import { translate } from '@/Translations/algorithm'
import { formatDate } from '@/Utils/Date'

const DateInput = ({ questionId, editable = true }) => {
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
  const [dateLanguage, setDateLanguage] = useState(enGB)
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(
    question.value ? fromUnixTime(question.value) : null,
  )

  /**
   * Save value in store
   * @param {Date} newDate
   */
  const handleConfirm = newDate => {
    setOpen(false)
    if (question.value !== newDate) {
      setDate(newDate)
      setAnswer(question.id, getUnixTime(newDate))
    }
  }

  useEffect(() => {
    if (systemLanguage === 'fr') {
      setDateLanguage(fr)
    }
  }, [])

  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)}>
        <TextInput
          style={string.input(editable)}
          value={date ? formatDate(date) : ''}
          editable={false}
          placeholder={
            currentNode.placeholder && translate(currentNode.placeholder)
          }
          pointerEvents="none"
        />
      </TouchableOpacity>
      <DatePicker
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

export default DateInput
