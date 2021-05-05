/**
 * The external imports
 */
import React, { useEffect, useRef } from 'react'
import { View, Text, Animated } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

/**
 * The internal imports
 */
import InitializeVersion from '@/Store/System/InitializeVersion'
import { useTheme } from '@/Theme'
import { SquareButton } from '@/Components'
import Loader from '@/Components/Loader'
import ToggleSwitch from '@/Components/ToggleSwitch'

const SynchronizationAuthContainer = () => {
  // Theme and style elements deconstruction
  const {
    Containers: { authSynchronization, auth },
    Fonts,
  } = useTheme()

  // Get values from the store
  const initializeVersionLoading = useSelector(
    state => state.system.initializeVersion.loading,
  )
  const healthFacilityFetchOneError = useSelector(
    state => state.healthFacility.fetchOne.error,
  )
  const algorithmFetchOneError = useSelector(
    state => state.algorithm.fetchOne.error,
  )
  const device = useSelector(state => state.device.item)

  // Define references
  const fadeAnim = useRef(new Animated.Value(0)).current

  const dispatch = useDispatch()

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])

  /**
   * Manages the synchronization action
   */
  const handleSynchronization = () => {
    dispatch(InitializeVersion.action({ json_version: null }))
  }

  return (
    <View style={auth.wrapper}>
      <Animated.View style={auth.animation(fadeAnim)}>
        <Text style={auth.header}>Synchronization</Text>

        <View style={authSynchronization.descriptionWrapper}>
          <Text style={[Fonts.textRegular]}>
            Associate device to a health facility
          </Text>
          <Text style={[Fonts.textRegular, Fonts.textBold]}>
            {device.mac_address}
          </Text>
        </View>

        <View style={authSynchronization.buttonWrapper}>
          <SquareButton
            content="Synchronize"
            filled
            handlePress={handleSynchronization}
            disabled={initializeVersionLoading}
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
        </View>

        <View style={authSynchronization.loaderContainer}>
          {initializeVersionLoading && <Loader height={200} />}
        </View>

        <View style={auth.themeToggleWrapper}>
          <ToggleSwitch label="Dark mode" />
        </View>
      </Animated.View>
    </View>
  )
}

export default SynchronizationAuthContainer
