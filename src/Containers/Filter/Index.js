/**
 * The external imports
 */
import React from 'react'
import { ScrollView, View, Text } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const IndexFilterContainer = () => {
  // Theme and style elements deconstruction
  const { Colors, Gutters, Layout } = useTheme()

  return (
    <ScrollView>
      <View style={[Layout.fill]}>
        <Text>Filters</Text>
      </View>
    </ScrollView>
  )
}

export default IndexFilterContainer
