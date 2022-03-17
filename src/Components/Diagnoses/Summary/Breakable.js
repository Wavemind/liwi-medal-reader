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
  const weight_question_id = useSelector(
    state => state.algorithm.item.config.basic_questions.weight_question_id,
  )
  const mcWeight = useSelector(
    state => state.medicalCase.item.nodes[weight_question_id],
  )

  // TODO: Waiting clinical team
  const drugInstance =
    nodes[drug.relatedDiagnoses[0].diagnosisId].drugs[drug.id]

  console.log('breakable', drug, drugDose)

  const fractionString = breakableFraction(drugDose)

  /**
   * Display frequency
   * @returns jsx
   */
  // TODO CHANGE IT TO A UNIQUE TRANSLATION
  const frequencyDisplay = () =>
    `${t('formulations.drug.every')} ${drugDose.recurrence} ${t(
      'formulations.drug.hour',
    )}`

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
   * Display dose indication
   * @returns JSX
   */
  const doseIndicationDisplay = () => {
    if (drugDose.by_age) {
      return (
        <Text>
          {t('formulations.drug.fixe_dose_breakable', {
            uniqueDose: drugDose.unique_dose,
          })}
        </Text>
      )
    } else {
      const dosage =
        drugDose.minimal_dose_per_kg +
        drugDose.maximal_dose_per_kg / 2 / drugDose.breakable

      return (
        <Text>
          {t('formulations.drug.dose_indication_breakable', {
            dosage: dosage,
            patientWeight: mcWeight.value,
            total: dosage * mcWeight.value,
          })}
        </Text>
      )
    }
  }

  /**
   * Display indication
   * @returns jsx
   */
  const indicationDisplay = () =>
    drug.relatedDiagnoses
      .map(finalDiagnose => translate(nodes[finalDiagnose.diagnosisId].label))
      .join(', ')

  return (
    <View>
      <Text style={summary.drugText}>
        <Text style={Fonts.textBold}>{t('formulations.drug.indication')}:</Text>{' '}
        {indicationDisplay()}
      </Text>
      <Text style={summary.drugText}>
        <Text style={Fonts.textBold}>
          {t('formulations.drug.dose_calculation')}:
        </Text>{' '}
        {doseIndicationDisplay()}
      </Text>
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
      <Text style={summary.drugText}>
        <Text style={Fonts.textBold}>
          {t('formulations.drug.amount_to_be_given')}:
        </Text>{' '}
        {fractionString} {t('formulations.drug.tablets')}
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

export default Breakable
