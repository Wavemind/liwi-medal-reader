/**
 * The external imports
 */
import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { translate } from '@/Translations/algorithm'
import { FormulationsPicker } from '@/Components'
import { useTheme } from '@/Theme'
import ChangeFormulations from '@/Store/MedicalCase/ChangeFormulations'

const FormulationDrugs = ({ drug, isLast, updateFormulations }) => {
  // Theme and style elements deconstruction
  const {
    Fonts,
    Layout,
    Containers: { formulations },
  } = useTheme()

  const dispatch = useDispatch()

  const nodes = useSelector(state => state.algorithm.item.nodes)

  /**
   * Updates the formulations in the store
   * @param drugId
   * @param formulationId
   */
  const updateStore = (drugId, formulationId) => {
    drug.relatedDiagnoses.map(diagnosis => {
      dispatch(
        ChangeFormulations.action({
          diagnosisKey: diagnosis.diagnosisKey,
          diagnosisId: diagnosis.diagnosisId,
          drugKey: diagnosis.drugKey,
          drugId,
          formulationId,
        }),
      )
    })
  }

  useEffect(() => {
    updateStore(drug.id, drug.selectedFormulationId)
  }, [drug.selectedFormulationId])

  return (
    <View style={formulations.drugWrapper(isLast)}>
      <View style={[Layout.row, Layout.justifyContentBetween]}>
        <View style={formulations.leftColumn}>
          <Text style={[Fonts.textSmall, Fonts.textBold]}>
            {translate(nodes[drug.id].label)}
          </Text>
          {drug.relatedDiagnoses.map(relatedDiagnosis => (
            <Text key={`formulation_diagnosis_text-${relatedDiagnosis.diagnosisId}`} style={Fonts.textSmall}>
              - {translate(nodes[relatedDiagnosis.diagnosisId].label)}
            </Text>
          ))}
        </View>
        <View style={formulations.rightColumn}>
          <View style={formulations.pickerWrapper}>
            <FormulationsPicker
              drug={drug}
              updateFormulations={updateFormulations}
            />
          </View>
        </View>
      </View>
      {drug.selectedFormulationId && (
        <Text style={formulations.selectedFormulationText}>
          {translate(
            nodes[drug.id].formulations.find(
              f => f.id === drug.selectedFormulationId,
            ).description,
          )}
        </Text>
      )}
    </View>
  )
}

export default FormulationDrugs
