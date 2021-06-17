/**
 * The external imports
 */
import React from 'react'
import { View, Text } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigation, useNavigationState } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { isFulfilled } from '@reduxjs/toolkit'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { SquareButton } from '@/Components'
import InsertPatient from '@/Store/Database/Patient/Insert'
import StepValidation from '@/Store/Validation/Step'

const StageWrapperNavbar = ({ stageIndex }) => {
  // Theme and style elements deconstruction
  const {
    Components: { bottomNavbar },
    Layout,
    Colors,
    FontSize,
    Fonts,
    Gutters,
  } = useTheme()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const navigation = useNavigation()
  const navigationState = useNavigationState(
    state => state.routes[state.index].state,
  )

  const advancement = useSelector(state => state.medicalCase.item.advancement)
  const errors = useSelector(state => state.validation.item)

  /**
   * Will navigate to the next step / Stage base on the current navigation State
   * @param {integer} direction : tell where we wanna navigate a positive number means we are going forwards and a negative number means we are going back
   */
  const handleNavigation = async (direction, skipValidation = false) => {
    let validation = null
    if (!skipValidation) {
      validation = await dispatch(StepValidation.action())
    }

    if (
      skipValidation ||
      (isFulfilled(validation) &&
        Object.values(validation.payload).length === 0)
    ) {
      // TODO: Need patient id in medicalCase when it's created
      if (advancement.stage === 0) {
        await dispatch(InsertPatient.action())
      }
      const medicalCaseState =
        navigationState.routes[navigationState.index].state

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
  }

  if (Object.keys(errors).length > 0) {
    return (
      <View
        style={[
          Gutters.smallVPadding,
          Gutters.smallHPadding,
          Layout.fill,
          Layout.row,

          { backgroundColor: Colors.red },
        ]}
      >
        <View style={[Layout.fill, Layout.row]}>
          <View style={[Layout.fill, Layout.center]}>
            <Text
              style={[Fonts.textLeft, Fonts.textRegular, { color: 'white' }]}
            >
              {Object.values(errors)[0]}
            </Text>
          </View>
        </View>
        <View style={[Layout.fill, Layout.row]}>
          <View style={[Layout.fill, Gutters.regularRMargin]}>
            <Text
              style={[
                Layout.alignItemsCenter,
                Fonts.textRight,
                Fonts.textRegular,
                { color: 'white' },
              ]}
            >
              {Object.values(errors).length}
            </Text>
          </View>
          <View style={[{ width: 50 }]}>
            <SquareButton
              filled
              icon="right-arrow"
              iconAfter
              bgColor={Colors.secondary}
              color={Colors.primary}
              iconSize={FontSize.large}
              onPress={() => dispatch(StepValidation.action())}
            />
          </View>
        </View>
      </View>
    )
  }

  return (
    <View
      style={[
        Gutters.smallVPadding,
        Gutters.smallHPadding,
        Layout.fill,
        Layout.row,
      ]}
    >
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
            onPress={() => handleNavigation(-1, true)}
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
