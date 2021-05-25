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

const Round = ({ parentStatus, step, stepIndex, stageIndex }) => {
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
   * TODO handle When we move to another stage
   */
  const handlePress = () => {
    if (stageIndex === currentStage) {
      navigation.navigate(step.label)
    } else {
      navigateToStage(stageIndex, 0)
    }
  }

  return (
    <TouchableOpacity disabled={!active} onPress={handlePress}>
      <View style={[sideBar.circle(parentStatus)]}>
        {active && <View style={sideBar.circleInner(parentStatus)} />}
      </View>
    </TouchableOpacity>
  )
}
export default Round
