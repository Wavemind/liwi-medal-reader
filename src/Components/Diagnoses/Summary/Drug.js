/**
 * The external imports
 */
import React from 'react'
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
  Liquid,
  Breakable,
  Capsule,
  Default,
} from '@/Components'
import { Config } from '@/Config'
import { DrugDosesService } from '@/Services/MedicalCase'

const Drug = ({ drug, isLast, diagnosisId }) => {
  // Theme and style elements deconstruction
  const {
    Containers: { finalDiagnoses, summary },
  } = useTheme()

  const { t } = useTranslation()

  const currentDrug = useSelector(state => state.algorithm.item.nodes[drug.id])

  /**
   * Display drug formulation based on medication form selected
   */
  const renderSwitchFormulation = () => {
    const formulations = currentDrug.formulations
    const formulationIndex = formulations
      .map(formulation => formulation.id)
      .indexOf(drug.formulation_id)
    const drugDose = DrugDosesService(formulationIndex, drug.id)

    if (formulations[formulationIndex] !== undefined) {
      switch (formulations[formulationIndex].medication_form) {
        case Config.MEDICATION_FORMS.syrup:
        case Config.MEDICATION_FORMS.suspension:
        case Config.MEDICATION_FORMS.powder_for_injection:
        case Config.MEDICATION_FORMS.solution:
          return (
            <Liquid diagnosisId={diagnosisId} drug={drug} drugDose={drugDose} />
          )
        case Config.MEDICATION_FORMS.tablet:
        case Config.MEDICATION_FORMS.dispersible_tablet:
          return (
            <Breakable
              diagnosisId={diagnosisId}
              drug={drug}
              drugDose={drugDose}
            />
          )
        case Config.MEDICATION_FORMS.capsule:
          return (
            <Capsule
              diagnosisId={diagnosisId}
              drug={drug}
              drugDose={drugDose}
            />
          )
        default:
          return (
            <Default
              diagnosisId={diagnosisId}
              drug={drug}
              drugDose={drugDose}
            />
          )
      }
    } else {
      return (
        <Text style={finalDiagnoses.noItemsText}>
          {t('formulations.drug.missing_medicine_formulation')}
        </Text>
      )
    }
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
      <View>{renderSwitchFormulation()}</View>
    </View>
  )
}

export default Drug
