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
import { breakableFraction } from '@/Utils/Formulations/BreakableFraction'
import { useTheme } from '@/Theme'

const Breakable = ({ drug, drugDose }) => {
  // Theme and style elements deconstruction
  const {
    Gutters,
    Containers: { summary },
  } = useTheme()

  const { t } = useTranslation()

  const nodes = useSelector(state => state.algorithm.item.nodes)
  const fractionString = breakableFraction(drugDose)

  const drugInstance =
    nodes[drug.relatedDiagnoses[0].diagnosisId].drugs[drug.id]
  console.log(drugDose)

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

  const formulationDisplay = () => {
    if (drugDose.by_age) {
      return `${roundSup(drugDose.unique_dose)} ${t(
        'formulations.drug.tablets',
      )} ${t('formulations.medication_form.per_administration')} `
    } else if (drugDose.doseResult === null) {
      return drugDose.no_possibility
    } else {
      return `${
        drugDose.doseResult * (drugDose.dose_form / drugDose.breakable)
      }${t('formulations.drug.mg')} ${t('formulations.drug.tablets')}`
    }
  }

  const durationInDays = drugInstance
    ? translate(drugInstance.duration)
    : drug.duration

  return (
    <>
      <Text style={summary.drugText}>
        Indication:{' '}
        {drug.relatedDiagnoses
          .map(finalDiagnose =>
            translate(nodes[finalDiagnose.diagnosisId].label),
          )
          .join(', ')}
      </Text>

      {/* TODO */}
      <Text style={summary.drugText}>Dose calculation:</Text>

      <Text style={summary.drugText}>Formulation: {formulationDisplay()}</Text>

      <Text style={summary.drugText}>
        Route: {drugDose.administration_route_name}
      </Text>

      <Text style={summary.drugText}>
        Amount to be given: {fractionString} {t('formulations.drug.tablets')}
      </Text>

      {translate(drugDose.injection_instructions) !== '' && (
        <Text style={summary.drugText}>
          Preparation instruction: {translate(drugDose.injection_instructions)}
        </Text>
      )}

      <Text style={summary.drugText}>Frequency: {frequencyDisplay()}</Text>

      <Text style={summary.drugText}>
        Duration: {durationInDays} {t('formulations.drug.days')}
      </Text>

      {translate(drugDose.dispensing_description) !== '' && (
        <Text style={summary.drugText}>
          Administration instruction:{' '}
          {translate(drugDose.dispensing_description)}
        </Text>
      )}
    </>
  )

  // const drugInstance = useSelector(
  //   state =>
  //     state.algorithm.item.nodes[drug.relatedDiagnoses[0].diagnosisId].drugs[
  //       drug.id
  //     ],
  // )

  // const fractionString = breakableFraction(drugDose)
  // console.log(drug)

  // const duration = drugInstance
  //   ? translate(drugInstance.duration)
  //   : drug.duration

  // const durationDisplay = drugInstance?.is_pre_referral
  //   ? `${t('formulations.drug.every')} ${drugDose.recurrence} ${t(
  //       'formulations.drug.hour',
  //     )} ${t('formulations.drug.during')} ${t(
  //       'formulations.drug.pre_referral',
  //     )}`
  //   : `${t('formulations.drug.every')} ${drugDose.recurrence} ${t(
  //       'formulations.drug.h',
  //     )} ${duration} ${t('formulations.drug.days')}`

  // return (
  //   <View>
  //     <Text style={summary.drugText}>{formulationLabel(drugDose)}</Text>
  //     {drugDose.by_age ? (
  //       <>
  //         <Text style={summary.drugText}>{`${roundSup(
  //           drugDose.unique_dose,
  //         )} ${t('formulations.drug.tablets')} ${t(
  //           'formulations.medication_form.per_administration',
  //         )} ${durationDisplay}`}</Text>
  //         <Text style={[Gutters.regularTMargin, summary.drugText]}>
  //           {translate(drugDose.dispensing_description)}
  //         </Text>
  //       </>
  //     ) : drugDose.doseResult === null ? (
  //       <Text style={summary.drugText}>{drugDose.no_possibility}</Text>
  //     ) : (
  //       <View>
  //         <Text style={summary.drugText}>
  //           {`${t('formulations.drug.give')} ${
  //             drugDose.doseResult * (drugDose.dose_form / drugDose.breakable)
  //           } ${t('formulations.drug.mg')} : ${fractionString} ${t(
  //             'formulations.drug.tablet',
  //           )} ${drugDose.dose_form}`}
  //           {t('formulations.drug.mg')} {drugDose.administration_route_name}
  //         </Text>
  //         <Text style={summary.drugText}>{durationDisplay}</Text>
  //         <Text style={[Gutters.regularTMargin, summary.drugText]}>
  //           {translate(drugDose.dispensing_description)}
  //         </Text>
  //       </View>
  //     )}
  //     {Config.ADMINISTRATION_ROUTE_CATEGORIES.includes(
  //       drugDose.administration_route_category,
  //     ) && (
  //       <Text
  //         style={[Gutters.regularTMargin, summary.drugText]}
  //         key={`text_${drug.id}`}
  //       >
  //         {translate(drugDose.injection_instructions)}
  //       </Text>
  //     )}
  //   </View>
  // )
}

export default Breakable
