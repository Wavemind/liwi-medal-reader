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

const Item = ({ item }) => {
  // Theme and style elements deconstruction
  const {
    Components: { accordionItem },
  } = useTheme()

  return (
    <View style={accordionItem.wrapper}>
      <Checkbox label={item.label} />
    </View>
  )
}

export default Item
