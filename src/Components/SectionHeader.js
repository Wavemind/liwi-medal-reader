import React from 'react'
import { View, Text } from 'react-native'
import { useTheme } from '@/Theme'

const SectionHeader = props => {
  const { label } = props
  const { Layout, Gutters, Common, Fonts } = useTheme()

  const styles = {
    beforeStyle: { height: 2, width: 50 },
    afterStyle: { height: 2 },
  }

  return (
    <View style={[Layout.row]}>
      <View style={[styles.beforeStyle, Common.backgroundBlack, Layout.selfCenter]} />
      <Text style={[Fonts.textSectionHeader, Layout.selfCenter, Gutters.largeHPadding]}>{label}</Text>
      <View style={[styles.afterStyle, Common.backgroundBlack, Layout.selfCenter, Layout.fill]} />
    </View>
  )
}

export default SectionHeader
