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
import { useTheme } from '@/Theme'
import { useSelector } from 'react-redux'

const Default = ({ drug, drugDose }) => {
  // Theme and style elements deconstruction
  const {
    Fonts,
    Containers: { summary },
  } = useTheme()

  const { t } = useTranslation()

  const nodes = useSelector(state => state.algorithm.item.nodes)

  // TODO: Waiting clinical team
  const drugInstance =
    nodes[drug.relatedDiagnoses[0].diagnosisId].drugs[drug.id]

  // console.log('Default', drug, drugDose)

  /**
   * Display indication
   * @returns jsx
   */
  const indicationDisplay = () =>
    drug.relatedDiagnoses
      .map(finalDiagnose => translate(nodes[finalDiagnose.diagnosisId].label))
      .join(', ')

  /**
   * Display durations
   * @returns jsx
   */
  const durationsDisplay = () => {
    // Pre-referral
    if (drugInstance?.is_pre_referral) {
      return t('formulations.drugs.pre_referral_duration')
    }

    // Normal behavior, take instance drug duration
    if (drugInstance) {
      return `${translate(drugInstance.duration)} ${t(
        'formulations.drug.days',
      )}`
    }

    // For additional and custom
    return `${drug.duration} ${t('formulations.drug.days')}`
  }

  /**
   * Display frequency
   * @returns jsx
   */
  const frequencyDisplay = () =>
    `${t('formulations.drug.every')} ${drugDose.recurrence} ${t(
      'formulations.drug.hour',
    )}`

  return (
    <View>
      <Text style={summary.drugText}>
        <Text style={Fonts.textBold}>{t('formulations.drug.indication')}:</Text>{' '}
        {indicationDisplay()}
      </Text>

      {/* TODO: Waiting clinical team FIXE DOSE -> SPRAY, PESSARY, PATCH application per administration | INHALER -> inhalations per administration  */}
      {/* <Text style={summary.drugText}>
        <Text style={Fonts.textBold}>Dose calculation:</Text>
      </Text> */}

      <Text style={summary.drugText}>
        <Text style={Fonts.textBold}>
          {t('formulations.drug.formulation')}:
        </Text>{' '}
        {formulationLabel(drugDose)}
      </Text>

      <Text style={summary.drugText}>
        <Text style={Fonts.textBold}>{t('formulations.drug.route')}:</Text>{' '}
        {t(
          `formulations.administration_routes.${drugDose.administration_route_name.toLowerCase()}`,
        )}
      </Text>

      {/* TODO: Ask clinical team */}
      <Text style={summary.drugText}>
        <Text style={Fonts.textBold}>
          {t('formulations.drug.amount_to_be_given')}:
        </Text>{' '}
        {/* {displayAmountGiven()} */}
      </Text>

      {translate(drugDose.injection_instructions) !== '' && (
        <Text style={summary.drugText}>
          <Text style={Fonts.textBold}>
            {t('formulations.drug.preparation_instruction')}:
          </Text>{' '}
          {translate(drugDose.injection_instructions)}
        </Text>
      )}

      <Text style={summary.drugText}>
        <Text style={Fonts.textBold}>{t('formulations.drug.frequency')}:</Text>{' '}
        {frequencyDisplay()}
      </Text>

      <Text style={summary.drugText}>
        <Text style={Fonts.textBold}>{t('formulations.drug.duration')}:</Text>{' '}
        {durationsDisplay()}
      </Text>

      {translate(drugDose.dispensing_description) !== '' && (
        <Text style={summary.drugText}>
          <Text style={Fonts.textBold}>
            {t('formulations.drug.administration_instruction')}:
          </Text>{' '}
          {translate(drugDose.dispensing_description)}
        </Text>
      )}
    </View>
  )
}

export default Default
