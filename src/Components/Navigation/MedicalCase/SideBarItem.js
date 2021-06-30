/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useNavigationState } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { navigateToStage } from '@/Navigators/Root'
import { RotatedText, Dot } from '@/Components'

const SideBarItem = ({ stage, index }) => {
  const { t } = useTranslation()
  const [status, setStatus] = useState('notDone')
  const navigationState = useNavigationState(state => state)
  const stageIndex =
    navigationState.routes[navigationState.index].params?.stageIndex || 0

  const {
    Components: { sideBar },
  } = useTheme()

  useEffect(() => {
    if (stageIndex === index) {
      setStatus('current')
    } else if (stageIndex > index) {
      setStatus('done')
    } else {
      setStatus('notDone')
    }
  }, [stageIndex, index])

  return (
    <TouchableOpacity
      disabled={status !== 'done'}
      onPress={() => navigateToStage(index, 0)}
    >
      <View style={sideBar.barItem(status)}>
        <RotatedText
          status={status}
          label={t(`containers.medical_case.stages.${stage.label}`)}
        />
        {stage.steps.map((step, stepIndex) => (
          <Dot
            key={`${step.label}_${stepIndex}`}
            step={step}
            stageIndex={index}
            status={status}
            stepIndex={stepIndex}
          />
        ))}
      </View>
    </TouchableOpacity>
  )
}

export default SideBarItem
