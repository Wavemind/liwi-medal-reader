import React from 'react'
import { View, Text, Button } from 'react-native'

import { useTheme } from '@/Theme'

const IndexModalContainer = props => {
  // Props deconstruction
  const { navigation } = props

  // Theme and style elements deconstruction
  const { Gutters, Layout, Fonts } = useTheme()

  return (
    <View style={[Layout.fill, Layout.colCenter, Gutters.largeHPadding]}>
      <Text style={[Fonts.textColorText]}>
        This is a full screen info modal
      </Text>
      <Button onPress={() => navigation.goBack()} title="Dismiss" />
    </View>
  )
}

export default IndexModalContainer
