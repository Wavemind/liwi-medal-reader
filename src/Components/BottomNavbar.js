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
import { SquareButton } from '@/Components'
import { navigateToStage } from '@/Navigators/Root'

const BottomNavbar = props => {
  const navigationState = useNavigationState(
    state => state.routes[state.index].state,
  )

  // Theme and style elements deconstruction
  const {
    Components: { bottomNavbar },
    Layout,
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
        return (
          <View style={[Layout.fill, Layout.row]}>
            {stageIndex > 0 ? (
              <View style={Layout.fill}>
                <SquareButton
                  label={'Back'}
                  filled
                  onPress={() => navigateToStage(stageIndex - 1, 0)}
                />
              </View>
            ) : null}
            <View style={Layout.fill}>
              <SquareButton
                label={'Next'}
                filled
                onPress={() => navigateToStage(stageIndex + 1, 0)}
              />
            </View>
          </View>
        )

      default:
        return null
    }
  }

  return (
    <View style={bottomNavbar.container}>
      <TouchableOpacity style={bottomNavbar.emergencyContainer}>
        <Icon name={'emergency'} style={bottomNavbar.emergency} />
      </TouchableOpacity>
      <RenderActions navigationState={navigationState} />
    </View>
  )
}

export default BottomNavbar
