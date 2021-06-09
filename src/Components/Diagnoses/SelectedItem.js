/**
 * The external imports
 */
import React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'

/**
 * The internal imports
 */
import { Icon } from '@/Components'
import { useTheme } from '@/Theme'

const SelectedItem = ({
  listItem,
  diagnosisId,
  listObject,
  isLast,
  withDuration,
  onRemovePress,
  onUpdateDuration,
  labelMethod,
}) => {
  // Theme and style elements deconstruction
  const {
    FontSize,
    Containers: { medicalCaseFinalDiagnoses },
    Components: { additionalSelect },
  } = useTheme()

  /**
   * Renders the duration textInput
   * @returns {JSX.Element}
   */
  const renderDuration = itemId => {
    return (
      <View>
        <TextInput
          style={additionalSelect.durationInput}
          onChangeText={duration =>
            onUpdateDuration(diagnosisId, itemId, duration)
          }
          value={listObject[itemId].duration}
          textAlign="center"
          keyboardType="default"
        />
      </View>
    )
  }

  return (
    <View style={medicalCaseFinalDiagnoses.newItemWrapper(isLast)}>
      <Text style={additionalSelect.itemLabel}>{labelMethod(listItem.id)}</Text>
      {withDuration && renderDuration(listItem.id)}
      <TouchableOpacity onPress={() => onRemovePress(listItem.id)}>
        <Icon style={{}} name="delete" size={FontSize.large} />
      </TouchableOpacity>
    </View>
  )
}

export default SelectedItem
