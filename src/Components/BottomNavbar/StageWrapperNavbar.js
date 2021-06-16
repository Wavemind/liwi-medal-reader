/**
 * The external imports
 */
import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigation, useNavigationState } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { SquareButton } from '@/Components'
import InsertPatient from '@/Store/Database/Patient/Insert'
import StepValidation from '@/Services/Validation/Step'
import { translate } from '@/Translations/algorithm'

const StageWrapperNavbar = ({ stageIndex }) => {
  // Theme and style elements deconstruction
  const {
    Components: { bottomNavbar },
    Layout,
    Colors,
    FontSize,
    Fonts,
  } = useTheme()
  const [errors, setErrors] = useState([])
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const navigation = useNavigation()
  const navigationState = useNavigationState(
    state => state.routes[state.index].state,
  )

  const advancement = useSelector(state => state.medicalCase.item.advancement)
  const nodes = useSelector(state => state.algorithm.item.nodes)

  /**
   * Will navigate to the next step / Stage base on the current navigation State
   * @param {integer} direction : tell where we wanna navigate a positive number means we are going forwards and a negative number means we are going back
   */
  const handleNavigation = async direction => {
    console.log('avant')
    const newErrors = StepValidation()
    setErrors(newErrors)
    // // TODO: Need patient id in medicalCase when it's created
    // if (advancement.stage === 0) {
    //   await dispatch(InsertPatient.action())
    // }
    // const medicalCaseState = navigationState.routes[navigationState.index].state

    // const nextStep = advancement.step + direction
    // if (
    //   medicalCaseState !== undefined &&
    //   nextStep < medicalCaseState.routes.length &&
    //   nextStep >= 0
    // ) {
    //   navigation.navigate(medicalCaseState.routes[nextStep].name)
    // } else {
    //   navigation.navigate('StageWrapper', {
    //     stageIndex: stageIndex + direction,
    //   })
    // }
  }
  console.log(errors)
  if (errors.length > 0) {
    return (
      <View style={[Layout.fill, { backgroundColor: 'red' }]}>
        {errors.map(error => (
          <Text key={error.id} style={[Fonts.textRegular, { color: 'white' }]}>
            {translate(nodes[error.id].label)} {error.message}
          </Text>
        ))}
      </View>
    )
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
