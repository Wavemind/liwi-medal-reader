/**
 * The external imports
 */
import React from 'react'
import { Picker } from '@react-native-picker/picker'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { DrugDosesService } from '@/Services/MedicalCase'
import ChangeFormulations from '@/Store/MedicalCase/ChangeFormulations'
import { formulationLabel } from '@/Utils/Formulations/FormulationLabel'

const FormulationsPicker = ({ drug }) => {
  // Theme and style elements deconstruction
  const {
    Colors,
    Containers: { formulations },
  } = useTheme()

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const nodes = useSelector(state => state.algorithm.item.nodes)

  /**
   * Updates the formulations in the local state
   * @param drugId
   * @param value
   */
  const updateFormulations = value => {
    drug.diagnoses.map(diagnosis => {
      dispatch(
        ChangeFormulations.action({
          diagnosisKey: diagnosis.key,
          diagnosisId: diagnosis.id,
          drugKey: drug.key === 'proposed' ? 'agreed' : drug.key,
          drugId: drug.id,
          formulationId: value,
        }),
      )
    })
  }
  return (
    <Picker
      style={formulations.picker}
      selectedValue={drug.selectedFormulationId}
      prompt="Formulations"
      onValueChange={updateFormulations}
      dropdownIconColor={Colors.primary}
    >
      <Picker.Item
        key="select-placeholder"
        label={t('actions.select')}
        value={null}
      />
      {Object.values(nodes[drug.id].formulations).map((formulation, index) => (
        <Picker.Item
          key={`select-${formulation.id}`}
          label={formulationLabel(DrugDosesService(index, drug.id))}
          value={formulation.id}
        />
      ))}
    </Picker>
  )
}
export default FormulationsPicker
