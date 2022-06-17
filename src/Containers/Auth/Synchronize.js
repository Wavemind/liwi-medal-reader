/**
 * The external imports
 */
import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  Animated,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { isFulfilled } from '@reduxjs/toolkit'

/**
 * The internal imports
 */
import { ToggleSwitchDarkMode, Loader, SquareButton } from '@/Components'
import { fadeIn } from '@/Theme/Animation'
import { useTheme } from '@/Theme'
import FetchOneHealthFacility from '@/Store/HealthFacility/FetchOne'
import FetchOneAlgorithm from '@/Store/Algorithm/FetchOne'
import FetchOneEmergency from '@/Store/Emergency/FetchOne'
import { navigateAndSimpleReset } from '@/Navigators/Root'

const SynchronizeAuthContainer = () => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Layout,
    Containers: { auth, authLogin, global },
  } = useTheme()
  const dispatch = useDispatch()

  // Define references
  const fadeAnim = useRef(new Animated.Value(0)).current
  const [loading, setLoading] = useState(false)

  // Get values from the store
  const healthFacilityFetchOneError = useSelector(
    state => state.healthFacility.fetchOne.error,
  )
  const algorithmFetchOneError = useSelector(
    state => state.algorithm.fetchOne.error,
  )
  const emergencyContentFetchOneError = useSelector(
    state => state.emergency.emergency.error,
  )

  useEffect(() => {
    fadeIn(fadeAnim)
  }, [fadeAnim])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    // Get health facility info
    const fetchOneHealthFacility = await dispatch(
      FetchOneHealthFacility.action({}),
    )

    if (isFulfilled(fetchOneHealthFacility)) {
      // Register device in medAl-creator
      const fetchOneAlgorithm = await dispatch(FetchOneAlgorithm.action({}))
      console.log("BEFORE HERE", fetchOneAlgorithm)
      if (isFulfilled(fetchOneAlgorithm)) {
        console.log("HERE", fetchOneAlgorithm)
        // Get emergency content
        const fetchOneEmergency = await dispatch(
          FetchOneEmergency.action({
            emergencyContentVersion: -1,
          }),
        )
        if (isFulfilled(fetchOneEmergency)) {
          setLoading(false)
          // Navigate and reset to Pin container
          navigateAndSimpleReset('Study', { source: 'auth' })
        }
      }
    }

    setLoading(false)
  }

  return (
    <KeyboardAvoidingView behavior="height" style={global.wrapper}>
      <Animated.View style={global.animation(fadeAnim)}>
        <Text style={auth.header}>
          {t('containers.auth.synchronize.title')}
        </Text>

        <View style={authLogin.formWrapper}>
          <View style={authLogin.buttonWrapper}>
            <SquareButton
              label={t('actions.synchronize')}
              filled
              disabled={loading}
              onPress={fetchData}
            />
          </View>

          {loading && (
            <View style={Layout.rowCenter}>
              <View style={authLogin.loaderWrapper}>
                <Loader />
              </View>
            </View>
          )}

          <View style={authLogin.buttonWrapper}>
            {healthFacilityFetchOneError && (
              <Text style={auth.errorMessage}>
                {healthFacilityFetchOneError.message}
              </Text>
            )}
            {algorithmFetchOneError && (
              <Text style={auth.errorMessage}>
                {algorithmFetchOneError.message}
              </Text>
            )}
            {emergencyContentFetchOneError && (
              <Text style={auth.errorMessage}>
                {emergencyContentFetchOneError.message}
              </Text>
            )}
          </View>
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

export default SynchronizeAuthContainer
