/**
 * The external imports
 */
import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon, ConnectionStatus } from '@/Components'

const Header = ({
  descriptor: {
    options: { title },
    navigation,
  },
}) => {
  // Theme and style elements deconstruction
  const {
    Components: { header },
  } = useTheme()

  const architecture = useSelector(
    state => state.healthFacility.item.architecture,
  )

  return (
    <View style={header.wrapper}>
      <View style={header.menu}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Icon name="menu" />
        </TouchableOpacity>
      </View>
      <View style={header.titleWrapper}>
        <Text style={header.title}>{title}</Text>
      </View>
      <View style={header.connectionStatusWrapper}>
        {architecture === 'client-server' && <ConnectionStatus />}
      </View>
    </View>
  )
}

export default Header
