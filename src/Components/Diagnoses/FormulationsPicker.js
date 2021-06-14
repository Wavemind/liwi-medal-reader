/**
 * The external imports
 */
import React from 'react'
import { Picker } from '@react-native-picker/picker'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { drugDoses } from '@/Utils/Formulations/DrugDoses'
import { formulationLabel } from '@/Utils/Formulations/FormulationLabel'

const FormulationsPicker = ({ drug, updateFormulations }) => {
  // Theme and style elements deconstruction
  const {
    Colors,
    Containers: { formulations },
  } = useTheme()

  const { t } = useTranslation()

  const nodes = useSelector(state => state.algorithm.item.nodes)

  return (
    <Picker
      style={formulations.picker}
      selectedValue={drug.selectedFormulationId}
      prompt="Formulations"
      onValueChange={value => updateFormulations(drug.id, value)}
      dropdownIconColor={Colors.primary}
    >
      <Picker.Item
        key="select-placeholder"
        label={t('actions.select')}
        value={null}
      />
      {Object.values(nodes[drug.id].formulations).map((formulation, index) => {
        const calculatedFormulation = drugDoses(index, drug.id)
        return (
          <Picker.Item
            key={`select-${formulation.id}`}
            label={formulationLabel(calculatedFormulation)}
            value={formulation.id}
          />
        )
      })}
    </Picker>
  )
}

export default FormulationsPicker
