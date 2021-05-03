import React, { useEffect, useRef } from 'react'
import { View, Text, Animated, ActivityIndicator } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import InitializeVersion from '@/Store/System/InitializeVersion'

import { useTheme } from '@/Theme'
import { SquareButton } from '@/Components'

const SynchronizationAuthContainer = props => {
  // Theme and style elements deconstruction
  const { Layout, Fonts } = useTheme()
  const dispatch = useDispatch()

  // Local state definition
  const initializeVersionLoading = useSelector(
    state => state.system.initializeVersion.loading,
  )
  const healthFacilityFetchOneError = useSelector(
    state => state.healthFacility.fetchOne.error,
  )
  const algorithmFetchOneError = useSelector(
    state => state.algorithm.fetchOne.error,
  )

  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])

  const handleSynchronization = () => {
    dispatch(InitializeVersion.action({ json_version: null }))
  }

  return (
    <Animated.View style={[Layout.fill, Layout.center, { opacity: fadeAnim }]}>
      <Text style={[Fonts.textColorText, Fonts.titleSmall]}>
        Synchronization
      </Text>
      <View style={[Layout.colVCenter, { width: 300 }]}>
        <SquareButton
          content="Synchronize"
          filled
          handlePress={handleSynchronization}
          disabled={initializeVersionLoading}
        />
        {initializeVersionLoading && (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
        {healthFacilityFetchOneError && (
          <Text style={Fonts.textRegular}>
            {healthFacilityFetchOneError.message}
          </Text>
        )}
        {algorithmFetchOneError && (
          <Text style={Fonts.textRegular}>
            {algorithmFetchOneError.message}
          </Text>
        )}
      </View>
    </Animated.View>
  )
}

export default SynchronizationAuthContainer
