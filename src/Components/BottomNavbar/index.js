/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useNavigationState, useNavigation } from '@react-navigation/native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'
import StageWrapperNavbar from './StageWrapperNavbar'
import SynchronizationNavbar from './SynchronizationNavbar'

const BottomNavbar = props => {
  const navigation = useNavigation()
  const navigationState = useNavigationState(state => state)

  // Theme and style elements deconstruction
  const {
    Components: { bottomNavbar },
  } = useTheme()

  /**
   * Renders the content of the bottom nav bar based on the current navigation route
   * @returns
   */
  const RenderActions = () => {
    const homeNavigation = navigationState.routes[navigationState.index].state

    const route = homeNavigation?.routes[navigationState.index]

    // Early return if navigation is not loaded
    if (route === undefined) {
      return null
    }
    const { name, params } = route

    const stageIndex = params?.stageIndex || 0
    switch (name) {
      case 'StageWrapper':
        return <StageWrapperNavbar stageIndex={stageIndex} />
      case 'Synchronization':
        return <SynchronizationNavbar />
      default:
        return null
    }
  }

  return (
    <View style={bottomNavbar.container}>
      <View style={bottomNavbar.emergencyContainer}>
        <TouchableOpacity
          style={bottomNavbar.emergencyWrapper}
          onPress={() =>
            navigation.navigate('InfoModal', { type: 'emergency' })
          }
        >
          <Icon name="emergency" style={bottomNavbar.emergency} />
        </TouchableOpacity>
      </View>
      <View style={bottomNavbar.actions}>
        <RenderActions navigationState={navigationState} />
      </View>
    </View>
  )
}

export default BottomNavbar
