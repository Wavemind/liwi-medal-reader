/**
 * The external imports
 */
import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  Animated,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import Clinician from '@/Components/Clinician'
import ToggleSwitch from '@/Components/ToggleSwitch'

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

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])

  // TODO FIX Toggle
  return (
    <KeyboardAvoidingView behavior="height" style={[auth.wrapper]}>
      <ScrollView contentContainerStyle={[Layout.grow]}>
        <Animated.View style={[Layout.fill]}>
          <Text style={auth.header}>{healthFacility.name}</Text>
          <View style={[Layout.fill, Layout.left]}>
            {healthFacility.medical_staffs.map(clinician => (
              <Clinician key={clinician.id} currentClinician={clinician} />
            ))}
          </View>

          <View style={auth.themeToggleWrapper}>
            <ToggleSwitch label={t('application.theme.dark_mode')} />
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default ClinicianSelectionAuthContainer
