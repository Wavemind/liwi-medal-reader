/**
 * The external imports
 */
import React from 'react'
import { Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { formulationLabel } from '@/Utils/Formulations/FormulationLabel'
import { roundSup } from '@/Utils/Formulations/RoundSup'
import { translate } from '@/Translations/algorithm'
import { Config } from '@/Config'
import { useTheme } from '@/Theme'

const Capsule = ({ drug, drugDose, diagnosisId }) => {
  // Theme and style elements deconstruction
  const {
    Gutters,
    Containers: { summary },
  } = useTheme()

  const { t } = useTranslation()

  const drugInstance = useSelector(
    state => state.algorithm.item.nodes[diagnosisId].drugs[drug.id],
  )

  return (
    <View>
      <Text style={summary.drugText}>{formulationLabel(drugDose)}</Text>
      {drugDose.by_age ? (
        <Text style={summary.drugText}>{`${roundSup(drugDose.unique_dose)} ${t(
          'formulations.drug.capsules',
        )} ${t('formulations.medication_form.per_administration')} ${t(
          'formulations.drug.every',
        )} ${drugDose.recurrence} ${t('formulations.drug.h')} ${t(
          'formulations.drug.during',
        )} ${drugInstance.duration} ${t('formulations.drug.days')}`}</Text>
      ) : drugDose.doseResult === null ? (
        <Text style={summary.drugText}>{drugDose.no_possibility}</Text>
      ) : (
        <>
          <Text style={summary.drugText}>
            {t('formulations.drug.give')}{' '}
            {drugDose.doseResult * drugDose.dose_form}{' '}
            {t('formulations.drug.mg')} : {drugDose.doseResult}{' '}
            {t('formulations.drug.caps')} {drugDose.dose_form}
            {t('formulations.drug.mg')} {drugDose.administration_route_name}
          </Text>
          <Text style={summary.drugText}>{`${t('formulations.drug.every')} ${
            drugDose.recurrence
          } ${t('formulations.drug.h')} ${drugInstance.duration} ${t(
            'formulations.drug.days',
          )}`}</Text>
          <Text style={[Gutters.regularTMargin, summary.drugText]}>
            {translate(drugDose.dispensing_description)}
          </Text>
        </>
      )}
      {Config.ADMINISTRATION_ROUTE_CATEGORIES.includes(
        drugDose.administration_route_category,
      ) && (
        <Text style={summary.drugText} key={`text_${drug.id}`}>
          {translate(drugDose.injection_instructions)}
        </Text>
      )}
    </View>
  )
}

export default Capsule
