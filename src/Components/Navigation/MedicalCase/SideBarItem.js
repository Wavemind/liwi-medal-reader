/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useNavigationState, useNavigation } from '@react-navigation/native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { navigateToStage } from '@/Navigators/Root'
import RotatedText from './RotatedText'
import Round from './Round'

const SideBarItem = ({ stage, index }) => {
  const navigationState = useNavigationState(state => state.routes[state.index])
  const [status, setStatus] = useState('notDone')

  const {
    Components: { sideBar },
  } = useTheme()

  const handleNavigate = () => {
    if (status === 'done') {
      navigateToStage(index, 0)
    }
  }

  useEffect(() => {
    if (navigationState.params?.stageIndex === index) {
      setStatus('current')
    } else if (navigationState.params?.stageIndex > index) {
      setStatus('done')
    } else {
      setStatus('notDone')
    }
  }, [navigationState.params?.stageIndex, index])

  return (
    <TouchableOpacity disabled={status !== 'done'} onPress={handleNavigate}>
      <View
        style={[
          sideBar.barItem,
          status === 'current' && sideBar.barItemCurrent,
        ]}
      >
        <RotatedText status={status} label={stage.label} />
        {stage.steps.map((step, stepIndex) => (
          <Round step={step} parentStatus={status} stepIndex={stepIndex} />
        ))}
      </View>
    </TouchableOpacity>
  )
}

export default SideBarItem
