/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useIsFocused } from '@react-navigation/native'
import isEqual from 'lodash/isEqual'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { FormulationDrugs } from '@/Components'
import { transformFormulations } from '@/Services/MedicalCase/TransformFormulations'
import {useSelector} from "react-redux";

const Formulations = ({}) => {
  // Theme and style elements deconstruction
  const {
    Gutters,
    Containers: { formulations },
  } = useTheme()

  const { t } = useTranslation()
  const isFocused = useIsFocused()

  const [drugs, setDrugs] = useState(transformFormulations())

  const algo = useSelector(s => s.algorithm.item)
  console.log(algo)

  /**
   * Transforms stored diagnoses/drugs into a usable local format
   */
  useEffect(() => {
    const newDrugs = transformFormulations()
    if (!isEqual(newDrugs, drugs)) {
      setDrugs(transformFormulations())
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

  return (
    <ScrollView>
      <View style={formulations.wrapper}>
        <View style={formulations.formulationsHeaderWrapper}>
          <Text style={formulations.formulationsHeader}>
            {t('containers.medical_case.formulations.title')}
          </Text>
        </View>
        <View style={[Gutters.regularHMargin, Gutters.regularVMargin]}>
          {Object.values(drugs).map((drug, i) => (
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

export default Formulations
