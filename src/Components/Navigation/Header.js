/**
 * The external imports
 */
import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon, ConnectionStatus } from '@/Components'

const Header = props => {
  // Props deconstruction
  const {
    options: { title },
    navigation,
  } = props.descriptor

  // Theme and style elements deconstruction
  const {
    Colors,
    Components: { header },
  } = useTheme()

  return (
    <View style={header.wrapper}>
      <View style={header.menu}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Icon name="menu" color={Colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={header.titleWrapper}>
        <Text style={header.title}>{title}</Text>
      </View>
      <View style={header.connectionStatusWrapper}>
        <ConnectionStatus />
      </View>
    </View>
  )
}

export default Header
