/**
 * The external imports
 */
import React from 'react'
import { View, FlatList } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { Question, Consent, BirthDate, SectionHeader } from '@/Components'
import { PatientString } from '@/Components/index'
import { useTheme } from '@/Theme'

const RegistrationMedicalCaseContainer = props => {
  const { t } = useTranslation()
  const { Gutters } = useTheme()

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

  let questions = [18, 50, 104, 168, 326, 204, 1774, 3436, 6, 7]

  return (
    <View>
      <FlatList
        removeClippedSubviews={false}
        ListHeaderComponent={<Header />}
        data={questions}
        renderItem={({ item }) => <Question questionId={item} />}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

export default RegistrationMedicalCaseContainer
