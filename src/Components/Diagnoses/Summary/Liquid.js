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

const Liquid = ({ drug, drugDose }) => {
  // Theme and style elements deconstruction
  const {
    Fonts,
    Containers: { summary },
  } = useTheme()

  const { t } = useTranslation()

  const nodes = useSelector(state => state.algorithm.item.nodes)
  const ratio = drugDose.liquid_concentration / drugDose.dose_form

  // TODO: Waiting clinical team
  const drugInstance =
    nodes[drug.relatedDiagnoses[0].diagnosisId].drugs[drug.id]

  console.log('liquid', drug)

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
      {t('formulations.drug.give')} {roundSup(ratio * drugDose.doseResult)}
      {t('formulations.drug.mg')}: {roundSup(drugDose.doseResult)}
      {t('formulations.drug.ml')} {t('formulations.drug.of')}{' '}
      {roundSup(drugDose.liquid_concentration)}
      {t('formulations.drug.mg')}/{drugDose.dose_form}
      {t('formulations.drug.ml')}
    </Text>
  )

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
    // <View>
    //   <Text style={summary.drugText}>{formulationLabel(drugDose)}</Text>
    //   {!drugDose.medication_form.includes([
    //     Config.MEDICATION_FORMS.solution,
    //     Config.MEDICATION_FORMS.powder_for_injection,
    //   ]) && drugDose.by_age ? (
    //     <Text style={summary.drugText}>{`${roundSup(
    //       drugDose.unique_dose,
    //     )}ml ${t(
    //       'formulations.medication_form.per_administration',
    //     )} ${durationDisplay}`}</Text>
    //   ) : drugDose.doseResult === null ? (
    //     <Text style={summary.drugText}>{drugDose.no_possibility}</Text>
    //   ) : (
    //     <View>
    //       <Text style={summary.drugText}>
    //         {t('formulations.drug.give')}{' '}
    //         {roundSup(ratio * drugDose.doseResult)}
    //         {t('formulations.drug.mg')}: {roundSup(drugDose.doseResult)}
    //         {t('formulations.drug.ml')} {t('formulations.drug.of')}{' '}
    //         {roundSup(drugDose.liquid_concentration)}
    //         {t('formulations.drug.mg')}/{drugDose.dose_form}
    //         {t('formulations.drug.ml')}
    //       </Text>
    //       <Text style={summary.drugText}>{durationDisplay}</Text>
    //     </View>
    //   )}

    //   {Config.ADMINISTRATION_ROUTE_CATEGORIES.includes(
    //     drugDose.administration_route_category,
    //   ) && (
    //     <Text
    //       style={[Gutters.regularTMargin, summary.drugText]}
    //       key={`text_${drug.id}`}
    //     >
    //       {translate(drugDose.injection_instructions)}
    //     </Text>
    //   )}
    //   <Text style={[Gutters.regularTMargin, summary.drugText]}>
    //     {translate(drugDose.dispensing_description)}
    //   </Text>
    // </View>
  )
}

export default Liquid
