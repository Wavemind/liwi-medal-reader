/**
 * The external imports
 */
import React from 'react'
import { View, VirtualizedList } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { Question, Consent, BirthDate, SectionHeader } from '@/Components'
import { PatientString } from '@/Components/index'
import { useTheme } from '@/Theme'

const RegistrationMedicalCaseContainer = props => {
  const { t } = useTranslation()
  const { Gutters } = useTheme()

  const questions = useSelector(
    state =>
      state.algorithm.item.mobile_config.questions_orders.registration_step,
  )

  /**
   * Returns the static questions for the medical case
   * @returns List of inputs to show
   */
  const Header = () => (
    <>
      <Consent />
      <View style={[Gutters.regularHMargin]}>
        <SectionHeader
          label={t('containers.medical_case.registration.questions')}
        />
      </View>

      <PatientString field="first_name" />
      <PatientString field="last_name" />
      <BirthDate />
    </>
  )

  /**
   * Convert data into readable value
   * @param {list of questions} data
   * @param {*} index
   * @returns
   */
  const getItem = (data, index) => ({
    id: data[index],
  })

  return (
    <VirtualizedList
      data={questions}
      ListHeaderComponent={<Header />}
      renderItem={({ item }) => <Question questionId={item.id} />}
      keyExtractor={item => item.key}
      getItemCount={() => Object.values(questions).length}
      getItem={getItem}
    />
  )
}

export default RegistrationMedicalCaseContainer
