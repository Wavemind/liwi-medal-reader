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

/**
 * The internal imports
 */
import { ToggleSwitchDarkMode } from '@/Components'
import { fadeIn } from '@/Theme/Animation'
import { useTheme } from '@/Theme'

const DataLoginAuthContainer = () => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Containers: { auth, authLogin, global },
  } = useTheme()

  // Define references
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    fadeIn(fadeAnim)
  }, [fadeAnim])

  return (
    <KeyboardAvoidingView behavior="height" style={global.wrapper}>
      <Animated.View style={global.animation(fadeAnim)}>
        <Text style={auth.header}>MedAL-DATA</Text>

        <View style={authLogin.formWrapper}></View>

        <SafeAreaView>
          <View style={auth.themeToggleWrapper}>
            <ToggleSwitchDarkMode label={t('application.theme.dark_mode')} />
          </View>
        </SafeAreaView>
      </Animated.View>
    </KeyboardAvoidingView>
  )
}

export default DataLoginAuthContainer
