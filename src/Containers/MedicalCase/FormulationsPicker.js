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
import { translate } from '@/Translations/algorithm'
import { useTheme } from '@/Theme'

const FormulationsPicker = ({ drug, index, updateFormulations }) => {
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
      onValueChange={value => updateFormulations(index, value)}
      dropdownIconColor={Colors.primary}
    >
      <Picker.Item
        key="select-placeholder"
        label={t('actions.select')}
        value={null}
      />
      {Object.values(nodes[drug.drugId].formulations).map(formulation => (
        <Picker.Item
          key={`select-${formulation.id}`}
          label={translate(formulation.description)}
          value={formulation.id}
        />
      ))}
    </Picker>
  )
}

export default FormulationsPicker
