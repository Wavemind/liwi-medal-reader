/**
 * The external imports
 */
import React from 'react'
import { View } from 'react-native'
import { useNavigation, useNavigationState } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { SquareButton } from '@/Components'
import { FontSize } from '@/Theme/Variables'

const StageWrapperNavbar = ({ stageIndex }) => {
  // Theme and style elements deconstruction
  const {
    Components: { bottomNavbar },
    Layout,
    Colors,
  } = useTheme()

  const { t } = useTranslation()
  const navigation = useNavigation()
  const navigationState = useNavigationState(
    state =>
      state.routes[state.index].state.routes[
        state.routes[state.index].state.index
      ].state,
  )

  /**
   * Will navigate to the next step / Stage base on the current navigation State
   * @param {integer} direction : tell where we wanna navigate a positive number means we are going forwards and a negative number means we are going back
   */
  const handleNavigation = direction => {
    const nextStep = navigationState?.index + direction
    if (
      navigationState !== undefined &&
      nextStep < navigationState.routes.length &&
      nextStep >= 0
    ) {
      navigation.navigate(navigationState.routes[nextStep].name)
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
            color={Colors.black}
            icon="left-arrow"
            align={Layout.alignItemsStart}
            iconSize={FontSize.regular}
            onPress={() => handleNavigation(-1)}
          />
        ) : null}
      </View>
      <View style={[Layout.fill, Layout.row]}>
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
