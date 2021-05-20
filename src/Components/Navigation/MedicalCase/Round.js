/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useNavigation, useNavigationState } from '@react-navigation/native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const Round = ({ parentStatus, step, stepIndex }) => {
  const {
    Components: { sideBar },
  } = useTheme()

  const navigation = useNavigation()
  const state = useNavigationState(
    state => state.routes[state.index].state?.index,
  )

  const [active, setActive] = useState(false)

  useEffect(() => {
    if (parentStatus === 'done') {
      setActive(true)
    } else if (parentStatus === 'notDone') {
      setActive(false)
    } else if (stepIndex <= state || stepIndex === 0) {
      setActive(true)
    } else {
      setActive(false)
    }
  }, [parentStatus, state, stepIndex])

  console.log(step)
  const handlePress = () => {
    navigation.navigate(step.label)
  }
  return (
    <TouchableOpacity onPress={handlePress}>
      <View
        style={[
          sideBar.circle,
          parentStatus === 'notDone' && sideBar.circleNotDone,
        ]}
      >
        {active && <View style={sideBar.circleInner} />}
      </View>
    </TouchableOpacity>
  )
}
export default Round
