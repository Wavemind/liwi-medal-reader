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
import {
  BirthDate,
  Consent,
  PatientString,
  SectionHeader,
} from '@/Components'
import { useTheme } from '@/Theme'

const RegistrationHeader = () => {
  const { Gutters } = useTheme()
  const { t } = useTranslation()

  const consentManagement = useSelector(
    state => state.algorithm.item.config.consent_management,
  )

  const other_uid = useSelector(state => state.patient.item.other_uid)
  return (
    <>
      {consentManagement && <Consent />}
      {other_uid && <PatientString field="reason" />}
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
