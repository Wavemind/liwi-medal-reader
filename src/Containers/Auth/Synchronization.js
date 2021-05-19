/**
 * The external imports
 */
import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Animated } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { isFulfilled } from '@reduxjs/toolkit'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { fadeIn } from '@/Theme/Animation'
import { SquareButton, Loader, ToggleSwitchDarkMode } from '@/Components'
import { navigateAndSimpleReset } from '@/Navigators/Root'
import FetchOneHealthFacility from '@/Store/HealthFacility/FetchOne'
import FetchOneAlgorithm from '@/Store/Algorithm/FetchOne'

const SynchronizationAuthContainer = () => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    Containers: { authSynchronization, auth, global },
    Fonts,
    Layout,
    Gutters,
  } = useTheme()

  // Local state definition
  const [loading, setLoading] = useState(false)

  // Get values from the store
  const healthFacilityFetchOneError = useSelector(
    state => state.healthFacility.fetchOne.error,
  )
  const algorithmFetchOneError = useSelector(
    state => state.algorithm.fetchOne.error,
  )
  const device = useSelector(state => state.device.item)

  // Define references
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    fadeIn(fadeAnim)
  }, [fadeAnim])

  /**
   * Dispatches the request for the Health Facility and then the request for the Algorithm
   */
  const handleSynchronization = async () => {
    setLoading(true)
    // Get health facility info
    const fetchOneHealthFacility = await dispatch(
      FetchOneHealthFacility.action({}),
    )

    if (isFulfilled(fetchOneHealthFacility)) {
      // Register device in medAl-creator
      const fetchOneAlgorithm = await dispatch(FetchOneAlgorithm.action({}))
      if (isFulfilled(fetchOneAlgorithm)) {
        // Navigate and reset to Pin container
        setLoading(false)
        navigateAndSimpleReset('ClinicianSelection')
      } else {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }

  return (
    <View style={global.wrapper}>
      <Animated.View style={global.animation(fadeAnim)}>
        <Text style={auth.header}>
          {t('containers.auth.synchronization.title')}
        </Text>

        <View style={authSynchronization.descriptionWrapper}>
          <Text style={[Fonts.textRegular]}>
            {t('containers.auth.synchronization.description')}
          </Text>
        </View>

        <View style={[Gutters.largeVMargin]}>
          <View style={[Layout.row]}>
            <View style={[Layout.fill]}>
              <Text style={[Fonts.textSmall]}>{t('device.name')}</Text>
            </View>
            <View style={[Layout.fill]}>
              <Text style={[Fonts.textSmall, Fonts.textBold]}>
                {device.name !== null
                  ? device.name
                  : t('device.name_not_available')}
              </Text>
            </View>
          </View>

          <View style={[Layout.row, Gutters.smallTMargin]}>
            <View style={[Layout.fill]}>
              <Text style={[Fonts.textSmall]}>{t('device.model')}</Text>
            </View>
            <View style={[Layout.fill]}>
              <Text style={[Fonts.textSmall, Fonts.textBold]}>
                {device.model}
              </Text>
            </View>
          </View>

          <View style={[Layout.row, Gutters.smallTMargin]}>
            <View style={[Layout.fill]}>
              <Text style={[Fonts.textSmall]}>{t('device.mac_address')}</Text>
            </View>
            <View style={[Layout.fill]}>
              <Text style={[Fonts.textSmall, Fonts.textBold]}>
                {device.mac_address}
              </Text>
            </View>
          </View>
        </View>

        <View style={authSynchronization.buttonWrapper}>
          <SquareButton
            label={t('actions.synchronize')}
            filled
            onPress={() => handleSynchronization()}
            disabled={loading}
          />
        </View>

        <View style={authSynchronization.errorMessageWrapper}>
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
          {loading && <Loader height={200} />}
        </View>

        <View style={auth.themeToggleWrapper}>
          <ToggleSwitchDarkMode label={t('application.theme.dark_mode')} />
        </View>
      </Animated.View>
    </View>
  )
}

export default SynchronizationAuthContainer
