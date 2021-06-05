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

  const medicalCase = useSelector(state => state.medicalCase.item)

  let questions = []
  questions.push(medicalCase.nodes[18])
  questions.push(medicalCase.nodes[50])
  questions.push(medicalCase.nodes[104])
  questions.push(medicalCase.nodes[168])
  questions.push(medicalCase.nodes[326])
  questions.push(medicalCase.nodes[204])
  questions.push(medicalCase.nodes[1774])
  questions.push(medicalCase.nodes[3436])
  questions.push(medicalCase.nodes[6])
  questions.push(medicalCase.nodes[7])

  return (
    <View>
      <FlatList
        removeClippedSubviews={false}
        ListHeaderComponent={<Header />}
        data={questions}
        renderItem={({ item }) => <Question node={item} />}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

export default RegistrationMedicalCaseContainer
