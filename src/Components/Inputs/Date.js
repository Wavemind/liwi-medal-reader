/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
import { View, TextInput } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Picker } from '@react-native-picker/picker'
import { useSelector } from 'react-redux'
import range from 'lodash/range'
import parse from 'date-fns/parse'
import format from 'date-fns/format'
import fr from 'date-fns/locale/fr'
import enGB from 'date-fns/locale/en-GB'
import subDays from 'date-fns/subDays'
import subMonths from 'date-fns/subMonths'
import subYears from 'date-fns/subYears'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Checkbox } from '@/Components'

const DateInput = ({ question, disabled = false }) => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Components: { select, numeric },
    Colors,
    Layout,
    Gutters,
  } = useTheme()

  // Local state definition
  const [dateLanguage, setDateLanguage] = useState(enGB)
  const [isEstimated, setIsEstimated] = useState(true)

  const [dateType, setDateType] = useState(null)
  const [dateTypeValue, setDateTypeValue] = useState('')

  const [dayValue, setDayValue] = useState(null)
  const [monthValue, setMonthValue] = useState(null)
  const [yearValue, setYearValue] = useState(null)

  const [daysRange, setDaysRange] = useState([])
  const [monthsRange, setMonthsRange] = useState([])
  const [yearsRange, setYearsRange] = useState([])

  // Get values from the store
  const algorithm = useSelector(state => state.algorithm.item)
  const systemLanguage = useSelector(state => state.system.language)

  useEffect(() => {
    if (question.value !== null) {
      // TODO: Must be replace by question.value
      // const date = new Date(null)
      // setDayValue(date.getDate())
      // setMonthValue(date.getMonth() + 1)
      // setYearValue(date.getFullYear())
    }

    const today = new Date()
    const days = range(1, 32)
    const months = range(1, 13)
    const years = range(
      today.getFullYear(),
      today.getFullYear() - algorithm.config.age_limit - 1,
    )

    setDaysRange(days)
    setMonthsRange(months)
    setYearsRange(years)

    // Load correct translation
    if (systemLanguage === 'fr') {
      setDateLanguage(fr)
    }
  }, [])

  /**
   * Store birth date
   */
  useEffect(() => {
    if (dayValue !== null && monthValue !== null && yearValue !== null) {
      console.log(
        'TODO: save birth date',
        parse(
          `${dayValue}-${monthValue}-${yearValue}`,
          'dd-MM-yyyy',
          new Date(),
        ),
      )
    }
  }, [dayValue, monthValue, yearValue])

  /**
   * Store estimated birth date
   */
  useEffect(() => {
    // TODO save in store new date
    if (dateTypeValue !== '' && dateType !== null) {
      let birthDate = ''
      if (dateType === 'day') {
        birthDate = subDays(new Date(), dateTypeValue)
      } else if (dateType === 'month') {
        birthDate = subMonths(new Date(), dateTypeValue)
      } else {
        birthDate = subYears(new Date(), dateTypeValue)
      }
      console.log('TODO: save birth date !', dateTypeValue, dateType, birthDate)
    }
  }, [dateTypeValue, dateType])

  /**
   * Check if there is no unpermitted char
   * @param {Event} e
   */
  const onChange = value => {
    const regWithComma = /^[0-9]+$/

    // Replace comma with dot
    if (regWithComma.test(value)) {
      value = value.replace(',', '.')
    }

    // Remove char that are not number or dot
    value = value.replace(/[^0-9]/g, '')

    setDateTypeValue(value)
  }

  return (
    <View>
      {isEstimated ? (
        <View style={Layout.column}>
          <View style={[select.pickerContainer(disabled)]}>
            <Picker
              style={select.picker}
              selectedValue={dateType}
              mode="dropdown"
              onValueChange={(value, itemIndex) => setDateType(value)}
              dropdownIconColor={Colors.primary}
              enabled={!disabled}
            >
              <Picker.Item
                key="select-date-type-placeholder"
                label={t('actions.select')}
                value={null}
              />
              <Picker.Item
                key="select-year"
                label={t('components.inputs.date.year')}
                value="year"
              />
              <Picker.Item
                key="select-month"
                label={t('components.inputs.date.month')}
                value="month"
              />
              <Picker.Item
                key="select-day"
                label={t('components.inputs.date.day')}
                value="day"
              />
            </Picker>
          </View>
          <View>
            <TextInput
              style={[numeric.input(!disabled), Gutters.smallTMargin]}
              keyboardType="decimal-pad"
              onChangeText={onChange}
              value={String(dateTypeValue)}
              editable={!disabled}
            />
          </View>
        </View>
      ) : (
        <View style={Layout.column}>
          <View style={select.pickerContainer(disabled)}>
            <Picker
              style={select.picker}
              selectedValue={yearValue}
              mode="dropdown"
              onValueChange={(year, itemIndex) => setYearValue(year)}
              dropdownIconColor={Colors.primary}
              enabled={!disabled}
            >
              <Picker.Item
                key="select-year-placeholder"
                label={t('components.inputs.date.year')}
                value={null}
              />
              {yearsRange.map(year => (
                <Picker.Item
                  key={`select-year-${year}`}
                  label={String(year)}
                  value={year}
                />
              ))}
            </Picker>
          </View>
          <View
            style={[select.pickerContainer(disabled), Gutters.smallTMargin]}
          >
            <Picker
              style={select.picker}
              selectedValue={monthValue}
              mode="dropdown"
              onValueChange={(month, itemIndex) => setMonthValue(month)}
              dropdownIconColor={Colors.primary}
              enabled={!disabled}
            >
              <Picker.Item
                key="select-month-placeholder"
                label={t('components.inputs.date.month')}
                value={null}
              />
              {monthsRange.map(month => (
                <Picker.Item
                  key={`select-month-${month}`}
                  label={format(
                    parse(`01-${month}-1970`, 'dd-MM-yyyy', new Date()),
                    'MMMM',
                    { locale: dateLanguage },
                  )}
                  value={month}
                />
              ))}
            </Picker>
          </View>
          <View
            style={[select.pickerContainer(disabled), Gutters.smallTMargin]}
          >
            <Picker
              style={select.picker}
              selectedValue={dayValue}
              mode="dropdown"
              onValueChange={(day, itemIndex) => setDayValue(day)}
              dropdownIconColor={Colors.primary}
              enabled={!disabled}
            >
              <Picker.Item
                key="select-day-placeholder"
                label={t('components.inputs.date.day')}
                value={null}
              />
              {daysRange.map(day => (
                <Picker.Item
                  key={`select-day-${day}`}
                  label={String(day)}
                  value={day}
                />
              ))}
            </Picker>
          </View>
        </View>
      )}
      <Checkbox
        label={t('components.inputs.numeric.estimated')}
        defaultValue={isEstimated}
        onPress={setIsEstimated}
      />
    </View>
  )
}

export default DateInput
