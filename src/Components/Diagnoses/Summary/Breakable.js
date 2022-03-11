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
import { translate } from '@/Translations/algorithm'
import { breakableFraction } from '@/Utils/Formulations/BreakableFraction'
import { useTheme } from '@/Theme'

const Breakable = ({ drug, drugDose }) => {
  // Theme and style elements deconstruction
  const {
    Fonts,
    Containers: { summary },
  } = useTheme()

  const { t } = useTranslation()

  const nodes = useSelector(state => state.algorithm.item.nodes)
  const fractionString = breakableFraction(drugDose)

  const drugInstance =
    nodes[drug.relatedDiagnoses[0].diagnosisId].drugs[drug.id]

  /**
   * Display frequency
   * @returns jsx
   */
  const frequencyDisplay = () => {
    if (drugInstance?.is_pre_referral) {
      return `${t('formulations.drug.every')} ${drugDose.recurrence} ${t(
        'formulations.drug.hour',
      )} ${t('formulations.drug.during')} ${t(
        'formulations.drug.pre_referral',
      )}`
    } else {
      return `${t('formulations.drug.every')} ${drugDose.recurrence} ${t(
        'formulations.drug.hour',
      )}`
    }
  }

  /**
   * Display durations
   * @returns jsx
   */
  const durationsDisplay = () => {
    if (drugInstance) {
      return `${translate(drugInstance.duration)} ${t(
        'formulations.drug.days',
      )}`
    }

    return `${drug.duration} ${t('formulations.drug.days')}`
  }

  const indicationDisplay = () =>
    drug.relatedDiagnoses
      .map(finalDiagnose => translate(nodes[finalDiagnose.diagnosisId].label))
      .join(', ')

  return (
    <View>
      <Text style={summary.drugText}>
        <Text style={Fonts.textBold}>Indication:</Text> {indicationDisplay()}
      </Text>

      {/* <Text style={summary.drugText}>
        <Text style={Fonts.textBold}>Dose calculation:</Text>
      </Text> */}

      <Text style={summary.drugText}>
        <Text style={Fonts.textBold}>Formulation:</Text>{' '}
        {formulationLabel(drugDose)}
      </Text>

      <Text style={summary.drugText}>
        <Text style={Fonts.textBold}>Route:</Text>{' '}
        {drugDose.administration_route_name}
      </Text>

      <Text style={summary.drugText}>
        <Text style={Fonts.textBold}>Amount to be given:</Text> {fractionString}{' '}
        {t('formulations.drug.tablets')}
      </Text>

      {translate(drugDose.injection_instructions) !== '' && (
        <Text style={summary.drugText}>
          <Text style={Fonts.textBold}>Preparation instruction:</Text>{' '}
          {translate(drugDose.injection_instructions)}
        </Text>
      )}

      <Text style={summary.drugText}>
        <Text style={Fonts.textBold}>Frequency:</Text> {frequencyDisplay()}
      </Text>

      <Text style={summary.drugText}>
        <Text style={Fonts.textBold}>Duration:</Text> {durationsDisplay()}
      </Text>

      {translate(drugDose.dispensing_description) !== '' && (
        <Text style={summary.drugText}>
          <Text style={Fonts.textBold}>Administration instruction:</Text>{' '}
          {translate(drugDose.dispensing_description)}
        </Text>
      )}
    </View>
  )
}

export default Breakable
