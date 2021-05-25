/**
 * The external imports
 */
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useNavigationState } from '@react-navigation/native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'
import StageWrapperNavbar from './StageWrapperNavbar'

const BottomNavbar = props => {
  const navigationState = useNavigationState(
    state => state.routes[state.index].state,
  )

  // Theme and style elements deconstruction
  const {
    Components: { bottomNavbar },
  } = useTheme()

  const RenderActions = () => {
    const route = navigationState?.routes[navigationState.index]

    // Early return if navigation is not loaded
    if (route === undefined) {
      return null
    }
    const { name, params } = route

    const stageIndex = params?.stageIndex || 0
    switch (name) {
      case 'StageWrapper':
        return <StageWrapperNavbar stageIndex={stageIndex} />

      default:
        return null
    }
  }

  return (
    <View style={bottomNavbar.container}>
      <View style={bottomNavbar.emergencyContainer}>
        <TouchableOpacity style={bottomNavbar.emergencyWrapper}>
          <Icon name={'emergency'} style={bottomNavbar.emergency} />
        </TouchableOpacity>
      </View>
      <View style={bottomNavbar.actions}>
        <RenderActions navigationState={navigationState} />
      </View>
    </View>
  )
}

export default BottomNavbar
