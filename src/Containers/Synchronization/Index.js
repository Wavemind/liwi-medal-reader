/**
 * The external imports
 */
import React, { useEffect, useRef, useState } from 'react'
import { Text, View, Animated } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { heightPercentageToDP } from 'react-native-responsive-screen'

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

  const syncStatus = useSelector(state => state.synchronization.status)

  // Local state definition
  const [unsynced, setUnsynced] = useState([])

  // Define references
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    async function setNonSynchronized() {
      const result = await GetNonSynchronizedService()
      setUnsynced(result)
    }
    setNonSynchronized()
  }, [syncLoading])

  useEffect(() => {
    fadeIn(fadeAnim)
  }, [fadeAnim])

  return (
    <Animated.View
      style={[Layout.fill, global.animation(fadeAnim), Gutters.regularHMargin]}
    >
      <View style={[Layout.center, Layout.fill]}>
        {syncLoading ? (
          <Loader height={Math.round(heightPercentageToDP(11))} />
        ) : (
          <>
            <Text style={synchronization.notSynchronized}>
              {t('containers.synchronization.not_synchronized')}
            </Text>
            <Text style={synchronization.counter}>{unsynced.length}</Text>
          </>
        )}
        {syncError && (
          <Text style={auth.errorMessage}>{syncError.message}</Text>
        )}
        {syncStatus && unsynced.length !== 0 && (
          <Text style={synchronization.notSynchronized}>{syncStatus}</Text>
        )}
      </View>
    </Animated.View>
  )
}

export default IndexSynchronizationContainer
