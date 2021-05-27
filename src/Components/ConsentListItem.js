/**
 * The external imports
 */
import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'

const ConsentListItem = props => {
  // Theme and style elements deconstruction
  const {
    Components: { consentListItem },
    Layout,
    Gutters,
    Fonts,
  } = useTheme()

  return (
    <TouchableOpacity
      style={consentListItem.wrapper}
      onPress={() => console.log('TODO')}
    >
      <View style={consentListItem.container}>
        <View style={consentListItem.titleWrapper}>
          <Text style={consentListItem.title}>Quentin Girard</Text>
          <Text>02.03.1994</Text>
        </View>
        <View style={consentListItem.dateWrapper}>
          <Text style={Fonts.textCenter}>10.02.2021</Text>
        </View>
        <View style={[Gutters.regularLMargin, Layout.column]}>
          <Icon name="right-arrow" size={25} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ConsentListItem
