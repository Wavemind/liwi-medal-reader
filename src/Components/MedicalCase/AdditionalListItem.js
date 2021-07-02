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

const AdditionalListItem = ({ item, handlePress, selected }) => {
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
        defaultValue={Object.keys(selected).includes(item.id.toString())}
      />
    </View>
  )
}

export default AdditionalListItem
