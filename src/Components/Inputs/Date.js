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
import differenceInDays from 'date-fns/differenceInDays'
import differenceInMonths from 'date-fns/differenceInMonths'
import differenceInYears from 'date-fns/differenceInYears'
import addDays from 'date-fns/addDays'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Checkbox } from '@/Components'
import UpdateField from '@/Store/Patient/UpdateField'
import HandleComplaintCategories from '@/Store/MedicalCase/HandleComplaintCategories'
import HandleDateFormulas from '@/Store/MedicalCase/HandleDateFormulas'

const DateInput = () => {
  // Theme and style elements deconstruction
  const {
    Components: { select, numeric },
    Colors,
    Layout,
    Gutters,
  } = useTheme()

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const birthDateEstimated = useSelector(
    state => state.patient.item.birth_date_estimated,
  )
  const medicalCaseCreatedAt = useSelector(
    state => state.medicalCase.item.createdAt,
  )

  const birthDateEstimatedType = useSelector(
    state => state.patient.item.birth_date_estimated_type,
  )

  // Local state definition
  const [dateLanguage, setDateLanguage] = useState(enGB)
  const [isEstimated, setIsEstimated] = useState(birthDateEstimated)

  const [estimatedDateType, setEstimatedDateType] = useState(
    birthDateEstimatedType,
  )
  const [estimatedValue, setEstimatedValue] = useState('')

  const [dayValue, setDayValue] = useState(null)
  const [monthValue, setMonthValue] = useState(null)
  const [yearValue, setYearValue] = useState(null)

  const [daysRange, setDaysRange] = useState([])
  const [monthsRange, setMonthsRange] = useState([])
  const [yearsRange, setYearsRange] = useState([])

  // Get values from the store
  const algorithm = useSelector(state => state.algorithm.item)
  const ageLimit = useSelector(state => state.algorithm.item.config.age_limit)

  const systemLanguage = useSelector(state => state.system.language)
  const birth_date = useSelector(state => state.patient.item.birth_date)

  useEffect(() => {
    if (birth_date !== null) {
      const date = new Date(birth_date)
      if (estimatedDateType) {
        let value = ''
        if (estimatedDateType === 'day') {
          value = differenceInDays(new Date(medicalCaseCreatedAt), date)
        } else if (estimatedDateType === 'month') {
          value = differenceInMonths(
            new Date(medicalCaseCreatedAt),
            addDays(date, -1),
          )
        } else {
          value = differenceInYears(
            new Date(medicalCaseCreatedAt),
            addDays(date, -1),
          )
        }
        setEstimatedValue(value)
      } else {
        setDayValue(date.getDate())
        setMonthValue(date.getMonth() + 1)
        setYearValue(date.getFullYear())
      }
    }

    if (__DEV__) {
      setDayValue(11)
      setMonthValue(4)
      setYearValue(2013)
    }

    const today = new Date()
    const days = range(1, 32)
    const months = range(1, 13)
    const years = range(today.getFullYear(), today.getFullYear() - ageLimit - 1)

    setDaysRange(days)
    setMonthsRange(months)
    setYearsRange(years)

    // Load correct translation
    if (systemLanguage === 'fr') {
      setDateLanguage(fr)
    }
  }, [])

  /**
   * Triggers the related actions when the birth date is set
   * @param {Timestamp} birthDate
   */
  const relatedActions = async birthDate => {
    // Trigger formulas related to birth date
    await dispatch(
      HandleDateFormulas.action({
        birthDate: birthDate,
        algorithm,
      }),
    )

    // Set default value for complain category
    dispatch(
      HandleComplaintCategories.action({
        birthDate: birthDate,
        algorithm,
      }),
    )
  }

  /**
   * Store birth date
   */
  useEffect(() => {
    if (dayValue !== null && monthValue !== null && yearValue !== null) {
      const birthDate = parse(
        `${dayValue}-${monthValue}-${yearValue}`,
        'dd-MM-yyyy',
        new Date(),
      )

      dispatch(
        UpdateField.action({
          field: 'birth_date',
          value: birthDate.getTime(),
        }),
      )
      relatedActions(birthDate.getTime())
    }
  }, [dayValue, monthValue, yearValue])

  /**
   * Store estimated birth date
   */
  useEffect(() => {
    if (estimatedValue !== '' && estimatedDateType !== null) {
      let birthDate = ''

      if (estimatedDateType === 'day') {
        birthDate = subDays(new Date(), Number(estimatedValue) + 1)
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
      relatedActions(birthDate.getTime())
    }
  }, [estimatedValue, estimatedDateType])

  /**
   * Check if there is no unpermitted char
   * @param {Event} e
   */
  const handleEstimatedValue = value => {
    value = value.replace(/[^0-9]/g, '')
    setEstimatedValue(value)
  }

  /**
   * Save in state + store estimated type
   */
  const handleEstimatedType = value => {
    setEstimatedDateType(value)
    dispatch(
      UpdateField.action({
        field: 'birth_date_estimated_type',
        value: value,
      }),
    )
  }

  /**
   * Reset the value of the field when we check and store the value in the patient store
   */
  const handleIsEstimated = value => {
    // TODO Improve it
    setIsEstimated(value)
    setEstimatedValue('')
    setEstimatedDateType('month')
    setDayValue(null)
    setMonthValue(null)
    setYearValue(null)
    dispatch(
      UpdateField.action({
        field: 'birth_date_estimated_type',
        value: null,
      }),
    )
    dispatch(
      UpdateField.action({
        field: 'birth_date_estimated',
        value: value,
      }),
    )
    relatedActions(null)
  }

  return (
    <View>
      {isEstimated ? (
        <View style={Layout.column}>
          <View style={select.pickerContainer(false)}>
            <Picker
              style={select.picker}
              selectedValue={estimatedDateType}
              mode="dropdown"
              onValueChange={handleEstimatedType}
              dropdownIconColor={Colors.primary}
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
              style={[numeric.input(true), Gutters.smallTMargin]}
              keyboardType="decimal-pad"
              onChangeText={handleEstimatedValue}
              value={String(estimatedValue)}
            />
          </View>
        </View>
      ) : (
        <View style={Layout.column}>
          <View style={select.pickerContainer(false)}>
            <Picker
              style={select.picker}
              selectedValue={yearValue}
              mode="dropdown"
              onValueChange={setYearValue}
              dropdownIconColor={Colors.primary}
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
          <View style={[select.pickerContainer(false), Gutters.smallTMargin]}>
            <Picker
              style={select.picker}
              selectedValue={monthValue}
              mode="dropdown"
              onValueChange={setMonthValue}
              dropdownIconColor={Colors.primary}
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
          <View style={[select.pickerContainer(false), Gutters.smallTMargin]}>
            <Picker
              style={select.picker}
              selectedValue={dayValue}
              mode="dropdown"
              onValueChange={setDayValue}
              dropdownIconColor={Colors.primary}
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
      )}
      <Checkbox
        label={t('answers.estimated_age')}
        defaultValue={isEstimated}
        onPress={handleIsEstimated}
      />
    </View>
  )
}

export default DateInput
