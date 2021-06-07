/**
 * The external imports
 */
import React from 'react'
import { View } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Checkbox } from '@/Components'
import { translate } from '@/Translations/algorithm'

const DrugItem = ({ item, handlePress, selected }) => {
  // Theme and style elements deconstruction
  const {
    Components: { diagnosisItem },
  } = useTheme()

  return (
    <View style={diagnosisItem.wrapper}>
      <Checkbox
        nodeId={item.id}
        label={translate(item.label)}
        onPress={handlePress}
        defaultValue={selected.includes(item.id)}
      />
    </View>
  )
}

export default DrugItem
