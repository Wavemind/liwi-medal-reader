/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
import { View, TextInput } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Picker } from '@react-native-picker/picker'
import { useSelector, useDispatch } from 'react-redux'
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
import UpdateField from '@/Store/Patient/UpdateField'

const DateInput = ({ question, disabled = false }) => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    Components: { select, numeric },
    Colors,
    Layout,
    Gutters,
  } = useTheme()

  // Local state definition
  const [dateLanguage, setDateLanguage] = useState(enGB)
  const [isEstimated, setIsEstimated] = useState(false)

  const [estimatedDateType, setEstimatedDateType] = useState(null)
  const [estimatedValue, setEstimatedValue] = useState('')

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
   * Reset the value of the field when we check
   */
  useEffect(() => {
    setEstimatedValue('')
    setEstimatedDateType(null)
    setDayValue(null)
    setMonthValue(null)
    setYearValue(null)
  }, [isEstimated])

  /**
   * Store birth date
   */
  useEffect(() => {
    if (dayValue !== null && monthValue !== null && yearValue !== null) {
      const date = parse(
        `${dayValue}-${monthValue}-${yearValue}`,
        'dd-MM-yyyy',
        new Date(),
      )
      dispatch(
        UpdateField.action({
          field: 'birth_date',
          value: date.getTime(),
        }),
      )
    }
  }, [dayValue, monthValue, yearValue])

  /**
   * Store estimated birth date
   */
  useEffect(() => {
    // TODO save in store new date
    if (estimatedValue !== '' && estimatedDateType !== null) {
      let birthDate = ''
      if (estimatedDateType === 'day') {
        birthDate = subDays(new Date(), estimatedValue)
      } else if (estimatedDateType === 'month') {
        birthDate = subMonths(new Date(), estimatedValue)
      } else {
        birthDate = subYears(new Date(), estimatedValue)
      }
      dispatch(
        UpdateField.action({
          field: 'birth_date',
          value: birthDate.getTime(),
        }),
      )
    }
  }, [estimatedValue, estimatedDateType])

  /**
   * Check if there is no unpermitted char
   * @param {Event} e
   */
  const onChange = value => {
    value = value.replace(/[^0-9]/g, '')
    setEstimatedValue(value)
  }

  const RenderEstimated = () => {
    return (
      <View style={Layout.column}>
        <View style={[select.pickerContainer(disabled)]}>
          <Picker
            style={select.picker}
            selectedValue={estimatedDateType}
            mode="dropdown"
            onValueChange={(value, itemIndex) => setEstimatedDateType(value)}
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
              label={t('answers.year')}
              value="year"
            />
            <Picker.Item
              key="select-month"
              label={t('answers.month')}
              value="month"
            />
            <Picker.Item
              key="select-day"
              label={t('answers.day')}
              value="day"
            />
          </Picker>
        </View>
        <View>
          <TextInput
            style={[numeric.input(!disabled), Gutters.smallTMargin]}
            keyboardType="decimal-pad"
            onChangeText={onChange}
            value={String(estimatedValue)}
            editable={!disabled}
          />
        </View>
      </View>
    )
  }

  const RenderStandard = () => {
    return (
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
              label={t('answers.year')}
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
        <View style={[select.pickerContainer(disabled), Gutters.smallTMargin]}>
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
              label={t('answers.month')}
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
        <View style={[select.pickerContainer(disabled), Gutters.smallTMargin]}>
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
              label={t('answers.day')}
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
    )
  }

  return (
    <View>
      {isEstimated ? <RenderEstimated /> : <RenderStandard />}
      <Checkbox
        label={t('answers.estimated')}
        defaultValue={isEstimated}
        onPress={setIsEstimated}
      />
    </View>
  )
}

export default DateInput
