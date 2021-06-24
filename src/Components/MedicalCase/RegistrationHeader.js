/**
 * The external imports
 */
import { View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The external imports
 */
import { BirthDate, Consent, PatientString, SectionHeader } from '@/Components'
import { useTheme } from '@/Theme'

const RegistrationHeader = () => {
  const { Gutters } = useTheme()
  const { t } = useTranslation()

  const consentManagement = useSelector(
    state => state.algorithm.item.config.consent_management,
  )

  const patient = useSelector(state => state.patient.item)
  const medicalCase = useSelector(state => state.medicalCase.item)

  console.log(patient)
  console.log(medicalCase)

  return (
    <>
      {consentManagement && <Consent />}
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
}

export default RegistrationHeader
