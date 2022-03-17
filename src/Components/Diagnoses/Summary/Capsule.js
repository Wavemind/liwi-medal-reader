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
import { useTheme } from '@/Theme'

const Capsule = ({ drug, drugDose }) => {
  // Theme and style elements deconstruction
  const {
    Fonts,
    Containers: { summary },
  } = useTheme()

  const { t } = useTranslation()

  const nodes = useSelector(state => state.algorithm.item.nodes)

  console.log('capsule', drug, drugDose)

  // TODO: Waiting clinical team
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

  /**
   * Display the amount should be given
   * @returns jsx
   */
  const displayAmountGiven = () => (
    <Text>
      {t('formulations.drug.give')} {drugDose.doseResult * drugDose.dose_form}{' '}
      {t('formulations.drug.mg')} : {drugDose.doseResult}{' '}
      {t('formulations.drug.caps')} {drugDose.dose_form}
      {t('formulations.drug.mg')} {drugDose.administration_route_name}
    </Text>
  )

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

      {/* TODO: Waiting clinical team */}
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

      <Text style={summary.drugText}>
        <Text style={Fonts.textBold}>
          {t('formulations.drug.amount_to_be_given')}:
        </Text>{' '}
        {displayAmountGiven()}
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

export default Capsule
