/**
 * The external imports
 */
import React, { useEffect, useRef, useState } from 'react'
import { Text, View, Animated } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { GetNonSynchronizedService } from '@/Services/MedicalCase'
import { useTheme } from '@/Theme'
import { fadeIn } from '@/Theme/Animation'
import { Loader } from '@/Components'

const IndexSynchronizationContainer = () => {
  // Theme and style elements deconstruction
  const {
    Layout,
    Gutters,
    Containers: { global, auth, synchronization },
  } = useTheme()

  const { t } = useTranslation()

  const syncError = useSelector(
    state => state.synchronization.synchronize.error,
  )
  const syncLoading = useSelector(
    state => state.synchronization.synchronize.loading,
  )

  // Local state definition
  const [unsynced, setUnsynced] = useState([])

  // Define references
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(async () => {
    const result = await GetNonSynchronizedService()
    setUnsynced(result)
  }, [syncLoading])

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
        <Text style={synchronization.counter}>{unsynced.length}</Text>
        {syncError && (
          <Text style={auth.errorMessage}>{syncError.message}</Text>
        )}
        {syncLoading && <Loader />}
      </View>
    </Animated.View>
  )
}

export default IndexSynchronizationContainer
