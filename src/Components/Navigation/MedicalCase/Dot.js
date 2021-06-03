/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { navigateToStage } from '@/Navigators/Root'

const Dot = ({ status, step, stepIndex, stageIndex, thinLines }) => {
  const navigation = useNavigation()
  const [active, setActive] = useState(false)

  const {
    Components: { sideBar },
  } = useTheme()

  const advancement = useSelector(state => state.medicalCase.item.advancement)

  useEffect(() => {
    if (status === 'done') {
      setActive(true)
    } else if (status === 'notDone') {
      setActive(false)
    } else if (stepIndex <= advancement.step || stepIndex === 0) {
      setActive(true)
    } else {
      setActive(false)
    }
  }, [status, advancement, stepIndex])

  /**
   * Will navigate to the related step
   */
  const handlePress = () => {
    if (stageIndex === advancement.stage) {
      navigation.navigate(step.label)
    } else {
      navigateToStage(stageIndex, 0)
    }
  }

  return (
    <>
      {(stepIndex !== 0 || thinLines) && (
        <View style={sideBar.separator(status, thinLines)} />
      )}
      <TouchableOpacity
        disabled={!active}
        onPress={handlePress}
        style={sideBar.circleHitBox}
      >
        <View style={sideBar.circle(status, thinLines)}>
          {active && <View style={sideBar.circleInner(status, thinLines)} />}
        </View>
      </TouchableOpacity>
    </>
  )
}
export default Dot
