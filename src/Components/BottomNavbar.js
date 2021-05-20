/**
 * The external imports
 */
import React, { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useNavigationState } from '@react-navigation/native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Config } from '@/Config'
import { Icon } from '@/Components'
import { FontSize } from '@/Theme/Variables'
import { SquareButton } from '@/Components'
import { navigateToStage } from '@/Navigators/Root'

const BottomNavbar = props => {
  // Props deconstruction
  const { disabled } = props
  const navigationState = useNavigationState(
    state => state.routes[state.index].state,
  )

  // Theme and style elements deconstruction
  const {
    Components: { bottomNavbar },
  } = useTheme()

  // Local state definition
  const [isSelected, setSelection] = useState(false)

  const RenderActions = () => {
    const route = navigationState?.routes[navigationState.index]
    // Early return if navigation is not loaded
    if (route === undefined) {
      return null
    }
    const { name, params } = route
    const stageIndex = params?.stageIndex || 0
    console.log(params, Config.NAVIGATION.INTERVENTION_STAGES)

    switch (name) {
      case 'StageWrapper':
        return (
          <SquareButton
            label={'Ma Bite'}
            filled
            onPress={() => navigateToStage(stageIndex + 1, 0)}
          />
        )

      default:
        return null
    }
  }

  return (
    <View style={bottomNavbar.container}>
      <TouchableOpacity
        onPress={() => setSelection(!isSelected)}
        style={bottomNavbar.emergencyContainer}
        disabled={disabled}
      >
        <Icon
          name={'emergency'}
          style={{
            fontSize: FontSize.huge,
            alignSelf: 'center',
          }}
        />
      </TouchableOpacity>
      <RenderActions navigationState={navigationState} />
    </View>
  )
}

export default BottomNavbar
