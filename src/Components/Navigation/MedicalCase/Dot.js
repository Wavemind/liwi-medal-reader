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
import { navigateToStage } from '@/Navigators/Root'

const Dot = ({ parentStatus, step, stepIndex, stageIndex, thinLines }) => {
  const navigation = useNavigation()
  const [active, setActive] = useState(false)

  const {
    Components: { sideBar },
  } = useTheme()

  const currentStep = useNavigationState(
    state => state.routes[state.index].state?.index,
  )
  const currentStage = useNavigationState(
    state => state.routes[state.index].params?.stageIndex,
  )

  useEffect(() => {
    if (parentStatus === 'done') {
      setActive(true)
    } else if (parentStatus === 'notDone') {
      setActive(false)
    } else if (stepIndex <= currentStep || stepIndex === 0) {
      setActive(true)
    } else {
      setActive(false)
    }
  }, [parentStatus, currentStep, stepIndex])

  /**
   * Will navigate to the related step
   */
  const handlePress = () => {
    if (stageIndex === currentStage) {
      navigation.navigate(step.label)
    } else {
      navigateToStage(stageIndex, 0)
    }
  }

  return (
    <>
      {(stepIndex !== 0 || thinLines) && (
        <View style={sideBar.separator(parentStatus, thinLines)} />
      )}
      <TouchableOpacity
        disabled={!active}
        onPress={handlePress}
        style={sideBar.circleHitBox}
      >
        <View style={sideBar.circle(parentStatus)}>
          {active && <View style={sideBar.circleInner(parentStatus)} />}
        </View>
      </TouchableOpacity>
    </>
  )
}
export default Dot
