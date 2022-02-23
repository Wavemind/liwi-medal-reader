/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useIsFocused } from '@react-navigation/native'
import isEqual from 'lodash/isEqual'
import orderBy from 'lodash/orderBy'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { FormulationDrugs } from '@/Components'
import { TransformFormulationsService } from '@/Services/MedicalCase'

const FormulationsMedicalCaseContainer = () => {
  // Theme and style elements deconstruction
  const {
    Gutters,
    Containers: { formulations },
  } = useTheme()

  const { t } = useTranslation()
  const isFocused = useIsFocused()

  const [drugs, setDrugs] = useState(TransformFormulationsService())
  const nodes = useSelector(state => state.algorithm.item.nodes)

  /**
   * Transforms stored diagnoses/drugs into a usable local format
   */
  useEffect(() => {
    const newDrugs = TransformFormulationsService()
    if (!isEqual(newDrugs, drugs)) {
      setDrugs(newDrugs)
    }
  }, [isFocused])

  /**
   * Updates the formulations in the local state
   * @param drugId
   * @param value
   */
  const updateFormulations = (drugId, value) => {
    const newDrugs = { ...drugs }
    newDrugs[drugId].selectedFormulationId = value
    setDrugs(newDrugs)
  }

  /**
   * Sorts the drugs by level_of_urgency
   * @returns {*}
   */
  const sortDrugsByUrgency = () =>
    orderBy(Object.values(drugs), drug => nodes[drug.id].level_of_urgency, [
      'desc',
      'asc',
    ])

  return (
    <ScrollView>
      <View style={formulations.wrapper}>
        <View style={formulations.formulationsHeaderWrapper}>
          <Text style={formulations.formulationsHeader}>
            {t('containers.medical_case.formulations.title')}
          </Text>
        </View>
        <View style={[Gutters.regularHMargin, Gutters.regularVMargin]}>
          {sortDrugsByUrgency().map((drug, i) => (
            <FormulationDrugs
              key={`formulation_drug-${drug.id}`}
              drug={drug}
              isLast={i === Object.values(drugs).length - 1}
              updateFormulations={updateFormulations}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

export default FormulationsMedicalCaseContainer
