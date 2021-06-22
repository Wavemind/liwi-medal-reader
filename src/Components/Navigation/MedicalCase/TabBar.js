/**
 * The external imports
 */
import React, { useEffect, useRef } from 'react'
import { View, ScrollView } from 'react-native'
import { heightPercentageToDP } from 'react-native-responsive-screen'
import { useDispatch, useSelector } from 'react-redux'
import uuid from 'react-native-uuid'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import TabBarItem from './TabBarItem'
import ChangeAdvancement from '@/Store/MedicalCase/ChangeAdvancement'
import AddStepActivities from '@/Store/MedicalCase/AddStepActivities'
import { getStages } from '@/Utils/Navigation/GetStages'

const TabBar = ({ state, navigation, navigationState, stageIndex }) => {
  const {
    Components: { tabBar },
    Layout,
  } = useTheme()
  const scrollRef = useRef()
  const dispatch = useDispatch()

  const stages = getStages()
  const macAddress = useSelector(state => state.device.item.mac_address)
  const clinician = useSelector(state => state.healthFacility.clinician)
  const medicalCaseId = useSelector(state => state.medicalCase.item.id)
  const medicalCaseFailSafe = useSelector(
    state => state.medicalCase.item.fail_safe,
  )

  /**
   * Updates the activities array with the new stage and step
   * TODO: MOVE IT TO StageWrapperNavBar ?
   */
  const updateMedicalCaseActivities = () => {
    const stage = stages[stageIndex]
    const step = stage.steps[navigationState.index]

    const stepActivities = {
      id: uuid.v4(),
      step: step.label,
      clinician: `${clinician.first_name} ${clinician.last_name}`,
      mac_address: macAddress,
      medical_case_id: medicalCaseId,
      fail_safe: medicalCaseFailSafe,
      nodes: [],
    }
    dispatch(AddStepActivities.action({ stepActivities }))
  }

  /**
   * Update the advancement in the store every time the step / stage changes
   * TODO: MOVE IT TO StageWrapperNavBar ?
   */
  const updateMedicalCaseAdvancement = async () => {
    await dispatch(
      ChangeAdvancement.action({
        newStage: stageIndex,
        newStep: navigationState.index,
      }),
    )
  }

  // Will Scroll to the right tab when moving between steps
  useEffect(() => {
    scrollRef.current?.scrollTo({
      x: navigationState.index * Math.round(heightPercentageToDP(21)),
      animated: true,
    })
  }, [navigationState.index])

  // Will update the medical case advancement
  useEffect(() => {
    updateMedicalCaseAdvancement()
    updateMedicalCaseActivities()
  }, [navigationState.index, stageIndex])

  const itemStatus = index => {
    if (state.index === index) {
      return 'current'
    } else if (state.index > index) {
      return 'done'
    } else {
      return 'toDo'
    }
  }

  return (
    <View>
      <View style={Layout.row}>
        <ScrollView
          alwaysBounceHorizontal={false}
          horizontal
          ref={scrollRef}
          scrollEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tabBar.wrapper}
        >
          {state.routes.map((route, index) => (
            <TabBarItem
              key={`tabBar_${index}`}
              index={index}
              status={itemStatus(index)}
              route={route}
              navigation={navigation}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  )
}
export default TabBar
