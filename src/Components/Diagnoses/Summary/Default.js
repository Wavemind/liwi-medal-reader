/**
 * The external imports
 */
import React from 'react'
import { Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { formulationLabel } from '@/Utils/Formulations/FormulationLabel'
import { translate } from '@/Translations/algorithm'
import { Config } from '@/Config'
import { useTheme } from '@/Theme'
import { useSelector } from 'react-redux'

const Default = ({ drug, drugDose, diagnosisId }) => {
  // Theme and style elements deconstruction
  const {
    Gutters,
    Containers: { summary },
  } = useTheme()

  const { t } = useTranslation()

  const drugInstance = useSelector(
    state => state.algorithm.item.nodes[diagnosisId].drugs[drug.id],
  )
  let every = ''

  const duration = drugInstance
    ? translate(drugInstance.duration)
    : drug.duration

  if (drug.formulationSelected !== null) {
    every = drugInstance?.is_pre_referral
      ? `
    ${t('formulations.drug.every')} ${24 / drugDose.doses_per_day} ${t(
          'formulations.drug.hour',
        )} ${t('formulations.drug.during')} ${t(
          'formulations.drug.pre_referral',
        )}`
      : `${t('formulations.drug.every')} ${24 / drugDose.doses_per_day} ${t(
          'formulations.drug.h',
        )} ${duration} ${t('formulations.drug.days')}`
  }

  return (
    <View>
      <Text>{formulationLabel(drugDose)}</Text>
      <Text style={summary.drugText}>
        {t('formulations.drug.d')}:{' '}
        {drugInstance.is_pre_referral
          ? `${t('formulations.drug.during')} ${t(
              'formulations.drug.pre_referral',
            )}`
          : duration}
      </Text>
      {drug.formulationSelected !== null && (
        <Text style={summary.drugText}>
          {t('formulations.drug.admin')}: {drugDose.administration_route_name}
        </Text>
      )}
      {drug.formulationSelected !== null && <Text>{every}</Text>}
      <Text style={[Gutters.regularTMargin, summary.drugText]}>
        {translate(drugDose.dispensing_description)}
      </Text>
      {Config.ADMINISTRATION_ROUTE_CATEGORIES.includes(
        drugDose.administration_route_category,
      ) && (
        <Text
          style={[Gutters.regularTMargin, summary.drugText]}
          key={`text_${drug.id}`}
        >
          {translate(drugDose.injection_instructions)}
        </Text>
      )}
    </View>
  )
}

export default Default
