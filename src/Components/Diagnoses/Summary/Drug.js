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
import { QuestionInfoButton, DoseIndication, AmountGiven } from '@/Components'
import { DrugDosesService } from '@/Services/MedicalCase'
// TODO: CHANGE IT TO A COMPONENT
import { formulationLabel } from '@/Utils/Formulations/FormulationLabel'

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
  }, [drug])

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
    // TODO: Waiting MedAL-C (forcing duration in integer. Should take the longest duration. BUT if one of theses is pre-referral Take it (don't care, display is the same))
    const drugInstance =
      nodes[drug.relatedDiagnoses[0].diagnosisId].drugs[drug.id]

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
      <View>
        <Text style={summary.drugText}>
          <Text style={Fonts.textBold}>
            {t('formulations.drug.indication')}:
          </Text>{' '}
          {indicationDisplay()}
        </Text>

        <Text style={summary.drugText}>
          <Text style={Fonts.textBold}>
            {t('formulations.drug.dose_calculation')}:
          </Text>{' '}
          <DoseIndication drugDose={drugDose} />
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
          {formulationLabel(drugDose)}
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
          {t('formulations.drug.frequency_indiction', {
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
      </View>
    </View>
  )
}

export default Drug
