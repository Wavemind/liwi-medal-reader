/**
 * The external imports
 */
import { Text, View, Switch } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import ChangeTheme from '@/Store/Theme/ChangeTheme'

const ToggleSwitchDarkMode = ({ label }) => {
  // Theme and style elements deconstruction
  const {
    Colors,
    Containers: { auth },
  } = useTheme()
  const dispatch = useDispatch()

  const theme = useSelector(state => state.theme)

  const [isEnabled, setIsEnabled] = useState(theme.darkMode)

  /**
   * Dispatches the theme change action to the store and toggles the local enabled state
   * @param theme
   * @param darkMode
   */
  const changeTheme = ({ newTheme, darkMode }) => {
    dispatch(ChangeTheme.action({ theme: newTheme, darkMode }))
    setIsEnabled(!isEnabled)
  }

  return (
    <View style={auth.switchOuterWrapper}>
      <Text style={auth.switchLabel}>{label}</Text>
      <View style={auth.switchInnerWrapper}>
        <Switch
          trackColor={{ false: Colors.grey, true: Colors.secondary }}
          thumbColor={isEnabled ? Colors.primary : Colors.secondary}
          onValueChange={() =>
            changeTheme({ theme: 'default', darkMode: !theme.darkMode })
          }
          value={isEnabled}
        />
      </View>
    </View>
  )
}

export default ToggleSwitchDarkMode
