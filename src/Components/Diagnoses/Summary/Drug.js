/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { translate } from '@/Translations/algorithm'
import { useTheme } from '@/Theme'
import {
  QuestionInfoButton,
  DoseCalculation,
  AmountGiven,
  Formulation,
} from '@/Components'
import { DrugDosesService } from '@/Services/MedicalCase'

const Drug = ({ drug, isLast }) => {
  const { t } = useTranslation()
  const {
    Fonts,
    Containers: { summary },
  } = useTheme()

  const currentDrug = useSelector(state => state.algorithm.item.nodes[drug.id])
  const nodes = useSelector(state => state.algorithm.item.nodes)
  const [drugDose, setDrugDose] = useState(null)

  useEffect(() => {
    const formulations = currentDrug.formulations
    const formulationIndex = formulations
      .map(formulation => formulation.id)
      .indexOf(drug.selectedFormulationId)

    setDrugDose(DrugDosesService(formulationIndex, drug.id))
  }, [drug.selectedFormulationId])

  /**
   * Display indication
   * TODO: HANDLE CUSTOM DIAGNOSIS
   * @returns jsx
   */
  const indicationDisplay = () =>
    drug.relatedDiagnoses
      .map(diagnose => translate(nodes[diagnose.diagnosisId].label))
      .join(', ')

  /**
   * Display durations
   * @returns jsx
   */
  const durationsDisplay = () => {
    // TODO: Waiting MedAL-C (forcing duration in integer. Should take the longest duration. BUT if one of theses is pre-referral Take it (don't care, display is the same))
    // LIWI-1704
    const drugInstance =
      nodes[drug.relatedDiagnoses[0].diagnosisId].drugs[drug.id]

    drug.relatedDiagnoses.forEach(diagnose => {
      var reg = new RegExp('^[0-9]$')
      // Test if contains number
      // Test if we translated, we contains number
      // console.log('HERE', reg.test(nodes[diagnose.diagnosisId].drugs[drug.id]))
    })

    console.log(drugInstance)
    // Pre-referral
    if (drugInstance?.is_pre_referral) {
      return t('formulations.drug.pre_referral_duration')
    }

    // Take instance drug duration or if custom or additional, take duration
    const duration = drugInstance
      ? translate(drugInstance.duration)
      : drug.duration

    return t('formulations.drug.duration_in_days', {
      count: parseInt(duration, 10),
    })
  }

  if (!drugDose) {
    return <Text>{t('actions.loading')}</Text>
  }

  return (
    <View style={summary.drugWrapper(isLast)}>
      <View style={summary.drugTitleWrapper}>
        <Text style={summary.drugTitle}>{translate(currentDrug.label)}</Text>
        {(translate(currentDrug.description) !== '' ||
          currentDrug.medias?.length > 0) && (
          <QuestionInfoButton nodeId={drug.id} />
        )}
      </View>
      <>
        <Text style={summary.drugText}>
          <Text style={Fonts.textBold}>
            {t('formulations.drug.indication')}: {indicationDisplay()}
          </Text>
        </Text>

        <Text style={summary.drugText}>
          <Text style={Fonts.textBold}>
            {t('formulations.drug.dose_calculation')}:
          </Text>{' '}
          <DoseCalculation drugDose={drugDose} />
        </Text>

        <Text style={summary.drugText}>
          <Text style={Fonts.textBold}>{t('formulations.drug.route')}:</Text>{' '}
          {t(
            `formulations.administration_routes.${drugDose.administration_route_name.toLowerCase()}`,
          )}
        </Text>

        <Text style={summary.drugText}>
          <Text style={Fonts.textBold}>
            {t('formulations.drug.formulation')}:
          </Text>{' '}
          <Formulation drugDose={drugDose} />
        </Text>

        <Text style={summary.drugText}>
          <Text style={Fonts.textBold}>
            {t('formulations.drug.amount_to_be_given')}:
          </Text>{' '}
          <AmountGiven drugDose={drugDose} />
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
          <Text style={Fonts.textBold}>
            {t('formulations.drug.frequency')}:
          </Text>{' '}
          {t('formulations.drug.frequency_indication', {
            doses_per_day: drugDose.doses_per_day,
            count: drugDose.recurrence,
          })}
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
      </>
    </View>
  )
}

export default Drug
