/**
 * The external imports
 */
import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  Animated,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

/**
 * The internal imports
 */
import { navigate } from '@/Navigators/Root'
import { ToggleSwitchDarkMode, SquareButton } from '@/Components'
import { fadeIn } from '@/Theme/Animation'
import { useTheme } from '@/Theme'
import ChangeEnrolment from '@/Store/System/ChangeEnrolment'

const EnrolmentSelectionAuthContainer = () => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Containers: { auth, authLogin, global },
    Gutters,
    Layout,
  } = useTheme()

  const dispatch = useDispatch()

  // Define references
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    fadeIn(fadeAnim)
  }, [fadeAnim])

  const setEnrolment = value => {
    dispatch(ChangeEnrolment.action({ newEnrolment: value }))
    navigate(value)
  }

  return (
    <KeyboardAvoidingView behavior="height" style={global.wrapper}>
      <Animated.View
        style={[global.animation(fadeAnim), Layout.justifyContentBetween]}
      >
        <Text style={auth.header}>Enrolment selection</Text>

        <View style={authLogin.formWrapper}>
          <SquareButton
            label="MedAL-C"
            filled
            onPress={() => setEnrolment('MedAL-C')}
          />
          <View style={Gutters.regularTMargin} />
          <SquareButton
            label="MedAL-Data"
            filled
            onPress={() => setEnrolment('MedAL-Data')}
          />
        </View>

        <SafeAreaView>
          <View style={auth.themeToggleWrapper}>
            <ToggleSwitchDarkMode label={t('application.theme.dark_mode')} />
          </View>
        </SafeAreaView>
      </Animated.View>
    </KeyboardAvoidingView>
  )
}

export default EnrolmentSelectionAuthContainer
