/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Picker } from '@react-native-picker/picker'
import { useSelector } from 'react-redux'
import * as _ from 'lodash'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { translate } from '@/Translations/algorithm'

const Test = ({ question, disabled = false }) => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Components: { select },
    Colors,
  } = useTheme()

  // Local state definition
  const [dayValue, setDayValue] = useState(null)
  const [monthValue, setMonthValue] = useState(null)
  const [yearValue, setYearValue] = useState(null)
  const [daysRange, setDaysRange] = useState([])
  const [monthsRange, setMonthsRange] = useState([])
  const [yearsRange, setYearsRange] = useState([])

  // Get values from the store
  const algorithm = useSelector(state => state.algorithm.item)

  // console.log(algorithm)

  useEffect(() => {
    if (question.value !== null) {
      const date = new Date(null) // Must be replace by question.value
      setDayValue(date.getDate())
      setMonthValue(date.getMonth() + 1)
      setYearValue(date.getFullYear())
    }

    const today = new Date()
    const days = _.range(1, 32)
    const months = _.range(1, 13)
    const years = _.range(
      today.getFullYear(),
      today.getFullYear() - algorithm.config.age_limit - 1,
    )

    setDaysRange(days)
    setMonthsRange(months)
    setYearsRange(years)
  }, [])

  /**
   * Set answer in medical case
   */
  const setAnswer = answerId => {
    // setValue(answerId)
  }
  console.log('Je suis update')

  return (
    <View style={select.pickerContainer(disabled)}>
      <Picker
        style={select.picker}
        selectedValue={yearValue}
        prompt={translate(question.label)}
        onValueChange={(answerId, itemIndex) => setYearValue(answerId)}
        dropdownIconColor={Colors.primary}
        enabled={!disabled}
      >
        <Picker.Item
          key="select-placeholder"
          label={t('actions.select')}
          value={null}
        />
        {yearsRange.map(year => (
          <Picker.Item key={`select-year-${year}`} label={year} value={year} />
        ))}
      </Picker>
    </View>
  )
}

export default Test
