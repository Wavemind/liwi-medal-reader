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
import { medicationForms } from '@/Utils/Formulations/Constants'
import { drugDoses } from '@/Services/MedicalCase/DrugDoses'

const DiagnosisDrugs = ({ drug, isLast }) => {
  // Theme and style elements deconstruction
  const {
    Containers: { finalDiagnoses, summary },
  } = useTheme()

  const { t } = useTranslation()

  const currentDrug = useSelector(state => state.algorithm.item.nodes[drug.id])

  /**
   * Display drug formulation based on medication form selected
   * @returns {*}
   * @private
   */
  const renderSwitchFormulation = () => {
    const formulations = currentDrug.formulations
    const formulationIndex = formulations
      .map(formulation => formulation.id)
      .indexOf(drug.formulation_id)
    const drugDose = drugDoses(formulationIndex, drug.id)

    if (formulations[formulationIndex] !== undefined) {
      switch (formulations[formulationIndex].medication_form) {
        case medicationForms.syrup:
        case medicationForms.suspension:
        case medicationForms.powder_for_injection:
        case medicationForms.solution:
          return <Liquid drug={drug} drugDose={drugDose} />
        case medicationForms.tablet:
        case medicationForms.dispersible_tablet:
          return <Breakable drug={drug} drugDose={drugDose} />
        case medicationForms.capsule:
          return <Capsule drug={drug} drugDose={drugDose} />
        default:
          return <Default drug={drug} drugDose={drugDose} />
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
        {translate(currentDrug.description) !== '' && (
          <QuestionInfoButton nodeId={drug.id} />
        )}
      </View>
      <View>{renderSwitchFormulation()}</View>
    </View>
  )
}

export default DiagnosisDrugs
