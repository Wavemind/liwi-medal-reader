/**
 * The external imports
 */
import React from 'react'
import { View } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigation, useNavigationState } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { SquareButton } from '@/Components'
import InsertPatient from '@/Store/Database/Patient/Insert'
import UpdateActivities from '@/Store/MedicalCase/UpdateActivities'
import { getStages } from '@/Utils/Navigation/GetStages'
import { store } from '@/Store'

const StageWrapperNavbar = ({ stageIndex }) => {
  // Theme and style elements deconstruction
  const {
    Components: { bottomNavbar },
    Layout,
    Colors,
    FontSize,
  } = useTheme()

  const dispatch = useDispatch()
  const { t } = useTranslation()
  const navigation = useNavigation()
  const navigationState = useNavigationState(
    state => state.routes[state.index].state,
  )
  const algo = useSelector(state => state.algorithm.item)
  // console.log(algo)

  const advancement = useSelector(state => state.medicalCase.item.advancement)

  /**
   * Will navigate to the next step / Stage base on the current navigation State
   * @param {integer} direction : tell where we wanna navigate a positive number means we are going forwards and a negative number means we are going back
   */
  const handleNavigation = async direction => {
    if (advancement.stage === 0) {
      await dispatch(InsertPatient.action())
    }
    const stages = getStages()
    const stage = stages[advancement.stage]
    const step = stage.steps[advancement.step]
    const stageActivities = {
      stage: stage.label,
      step: step.label,
      questions: [],
    }
    await dispatch(UpdateActivities.action({ stageActivities }))

    const medicalCase = store.getState().medicalCase.item
    console.log(medicalCase)

    const medicalCaseState = navigationState.routes[navigationState.index].state

    const nextStep = advancement.step + direction
    if (
      medicalCaseState !== undefined &&
      nextStep < medicalCaseState.routes.length &&
      nextStep >= 0
    ) {
      navigation.navigate(medicalCaseState.routes[nextStep].name)
    } else {
      navigation.navigate('StageWrapper', {
        stageIndex: stageIndex + direction,
      })
    }
  }

  return (
    <View style={[Layout.fill, Layout.row]}>
      <View style={[Layout.fill, Layout.row]}>
        {stageIndex > 0 ? (
          <SquareButton
            label={t('containers.medical_case.navigation.back')}
            filled
            bgColor={Colors.secondary}
            color={Colors.primary}
            icon="left-arrow"
            align={Layout.alignItemsStart}
            iconSize={FontSize.regular}
            onPress={() => handleNavigation(-1)}
          />
        ) : null}
      </View>
      <View style={[Layout.fill, Layout.row]}>
        {advancement.stage > 0 && (
          <View style={bottomNavbar.actionButton}>
            <SquareButton
              label={t('containers.medical_case.navigation.quit')}
              filled
              bgColor={Colors.grey}
              icon="save-quit"
              iconSize={FontSize.large}
              onPress={() => console.log('TODO')}
            />
          </View>
        )}

        <View style={bottomNavbar.actionButton}>
          <SquareButton
            label={t('containers.medical_case.navigation.next')}
            filled
            icon="right-arrow"
            iconAfter
            iconSize={FontSize.regular}
            onPress={() => handleNavigation(1)}
          />
        </View>
      </View>
    </View>
  )
}

export default StageWrapperNavbar
