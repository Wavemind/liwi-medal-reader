/**
 * The external imports
 */
import React from 'react'
import { ScrollView, View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { SectionHeader, PatientPersonalInfoItem } from '@/Components'
import { translate } from '@/Translations/algorithm'
import { formatDate } from '@/Utils/Date'

const PersonalInfoPatientContainer = () => {
  const {
    Fonts,
    Gutters,
    Containers: { patientPersonalInfo },
  } = useTheme()

  const { t } = useTranslation()

  const nodes = useSelector(state => state.algorithm.item.nodes)
  const patient = useSelector(state => state.patient.item)
  const birthDateValue = patient.birth_date
    ? formatDate(patient.birth_date)
    : null

  // Array of basic patient information for iteration
  const patientInformation = [
    { label: t('patient.first_name'), value: patient.first_name },
    { label: t('patient.last_name'), value: patient.last_name },
    {
      label: t('patient.birth_date'),
      value: birthDateValue,
    },
  ]

  /**
   * Renders the correct answer depending on whether answer_id is null or not
   * @param patientValue : A single patientValue to be checked for its answer
   * @returns {*}
   */
  const renderAnswer = patientValue => {
    if (patientValue.answer_id !== null) {
      return translate(
        nodes[patientValue.node_id].answers[patientValue.answer_id].label,
      )
    }
    return patientValue.value
  }

  return (
    <ScrollView contentContainerStyle={patientPersonalInfo.wrapper}>
      <SectionHeader
        label={t('containers.patient.personal_info.patient_info')}
      />
      <Text style={patientPersonalInfo.uuid}>UUID: {patient.id}</Text>
      {patientInformation.map((info, i) => (
        <PatientPersonalInfoItem
          key={`patient_information_${i}`}
          label={info.label}
          value={info.value}
        />
      ))}
      <View style={Gutters.largeTMargin}>
        <SectionHeader
          label={t('containers.patient.personal_info.consultations_info')}
        />
        {patient.patientValues.map(patientValue => (
          <PatientPersonalInfoItem
            key={`patient_information_${patientValue.node_id}`}
            label={translate(nodes[patientValue.node_id].label)}
            value={renderAnswer(patientValue)}
          />
        ))}
      </View>
    </ScrollView>
  )
}

export default PersonalInfoPatientContainer
