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
import { useTheme } from '@/Theme'
import { fadeIn } from '@/Theme/Animation'
import { Loader } from '@/Components'

const IndexSynchronizationContainer = props => {
  // Theme and style elements deconstruction
  const {
    Layout,
    Gutters,
    Containers: { global, auth, synchronization },
  } = useTheme()

  const { t } = useTranslation()

  const syncError = useSelector(state => state.synchronization.error)
  const syncLoading = useSelector(state => state.synchronization.loading)
  const medicalCases = useSelector(
    state => state.databaseMedicalCase.getAll.item.data,
  )

  // Define references
  const fadeAnim = useRef(new Animated.Value(0)).current

  // Local state definition
  const [unSynced] = useState(
    medicalCases.filter(medicalCase => medicalCase.synchronizedAt === 0),
  )

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
        <Text style={synchronization.counter}>{unSynced.length}</Text>
        {syncError && (
          <Text style={auth.errorMessage}>{syncError.message}</Text>
        )}
        {syncLoading && <Loader />}
      </View>
    </Animated.View>
  )
}

export default IndexSynchronizationContainer
