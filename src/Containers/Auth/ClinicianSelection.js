/**
 * The external imports
 */
import React, { useEffect, useRef } from 'react'
import { View, Text, Animated } from 'react-native'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import Clinician from '@/Components/Clinician'
import ToggleSwitch from '@/Components/ToggleSwitch'

const ClinicianSelectionAuthContainer = props => {
  // Theme and style elements deconstruction
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

  return (
    <View style={auth.wrapper}>
      <Animated.View style={auth.animation(fadeAnim)}>
        <Text style={auth.header}>{healthFacility.name}</Text>
        <View style={[Layout.fill, Layout.left]}>
          {healthFacility.medical_staffs.map(clinician => (
            <Clinician key={clinician.id} currentClinician={clinician} />
          ))}
        </View>

        <View style={auth.themeToggleWrapper}>
          <ToggleSwitch label="Dark mode" />
        </View>
      </Animated.View>
    </View>
  )
}

export default ClinicianSelectionAuthContainer
