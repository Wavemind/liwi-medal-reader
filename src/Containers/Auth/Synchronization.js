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

        <View style={authSynchronization.buttonWrapper}>
          {initializeVersionLoading ? (
            <Loader height={200} />
          ) : (
            <SquareButton
              content="Synchronize"
              filled
              handlePress={handleSynchronization}
              disabled={initializeVersionLoading}
            />
          )}

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

        <View style={auth.themeToggleWrapper}>
          <ToggleSwitch label="Dark mode" />
        </View>
      </Animated.View>
    </View>
  )
}

export default SynchronizationAuthContainer
