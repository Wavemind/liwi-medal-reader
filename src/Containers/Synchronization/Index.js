/**
 * The external imports
 */
import React, { useEffect, useRef } from 'react'
import { Text, View, Animated } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { fadeIn } from '@/Theme/Animation'

const IndexSynchronizationContainer = props => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Containers: { global, synchronization },
    Layout,
    Gutters,
  } = useTheme()

  // Define references
  const fadeAnim = useRef(new Animated.Value(0)).current

  // Local state definition

  useEffect(() => {
    fadeIn(fadeAnim)
  }, [fadeAnim])

  return (
    <Animated.View
      style={[Layout.fill, global.animation(fadeAnim), Gutters.regularHMargin]}
    >
      <View style={[Layout.center, Layout.fill]}>
        <Text style={synchronization.notSynchronized}>
          {t('containers.synchronization.not_synchronized')}
        </Text>
        <Text style={synchronization.counter}>0</Text>
      </View>
    </Animated.View>
  )
}

export default IndexSynchronizationContainer
