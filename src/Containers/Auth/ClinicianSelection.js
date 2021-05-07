/**
 * The external imports
 */
import React, { useEffect, useRef } from 'react'
import { View, Text, Animated, ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { fadeIn } from '@/Theme/Animation'
import { Clinician, ToggleSwitchDarkMode } from '@/Components'
import { navigate } from '@/Navigators/Root'

const ClinicianSelectionAuthContainer = props => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Layout,
    Containers: { auth },
  } = useTheme()

  // Local state definition
  const fadeAnim = useRef(new Animated.Value(0)).current
  const healthFacility = useSelector(state => state.healthFacility.item)
  const algorithmUpdated = useSelector(state => state.algorithm.item.updated)

  useEffect(() => {
    fadeIn(fadeAnim)
  }, [fadeAnim])

  useEffect(() => {
    if (algorithmUpdated) {
      navigate('InfoModal', { type: 'study' })
    }
  }, [algorithmUpdated])

  return (
    <ScrollView contentContainerStyle={[Layout.grow]}>
      <Animated.View
        style={[Layout.fill, auth.animation(fadeAnim), auth.wrapper]}
      >
        <Text style={auth.header}>{healthFacility.name}</Text>
        <View style={[Layout.fill, Layout.left]}>
          {healthFacility.medical_staffs.map(clinician => (
            <Clinician key={clinician.id} currentClinician={clinician} />
          ))}
        </View>

        <View style={auth.themeToggleWrapper}>
          <ToggleSwitchDarkMode label={t('application.theme.dark_mode')} />
        </View>
      </Animated.View>
    </ScrollView>
  )
}

export default ClinicianSelectionAuthContainer
