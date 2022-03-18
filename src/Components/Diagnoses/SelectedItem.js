/**
 * The external imports
 */
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { Icon, QuestionInfoButton } from '@/Components'
import { useTheme } from '@/Theme'
import { translate } from '@/Translations/algorithm'

const SelectedItem = ({ listItem, isLast, onRemovePress, labelMethod }) => {
  // Theme and style elements deconstruction
  const {
    FontSize,
    Containers: { finalDiagnoses },
    Components: { additionalSelect },
  } = useTheme()

  const nodes = useSelector(state => state.algorithm.item.nodes)
  const currentNode = nodes[listItem.id]

  return (
    <View style={finalDiagnoses.newItemWrapper(isLast)}>
      <View style={additionalSelect.itemLabelWrapper}>
        <Text style={additionalSelect.itemLabel}>
          {labelMethod(listItem.id)}
        </Text>
        {currentNode &&
          (translate(currentNode.description) !== '' ||
            currentNode.medias?.length > 0) && (
            <QuestionInfoButton nodeId={listItem.id} />
          )}
      </View>
      <TouchableOpacity onPress={() => onRemovePress(listItem.id)}>
        <Icon style={{}} name="delete" size={FontSize.large} />
      </TouchableOpacity>
    </View>
  )
}

export default SelectedItem
