import React, { useEffect, useRef } from 'react'
import { View, Text, Animated, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import ChangeClinician from '@/Store/HealthFacility/ChangeClinician'
import { navigateAndSimpleReset } from '@/Navigators/Root'
import { useTheme } from '@/Theme'

const ClinicianSelectionAuthContainer = props => {
  // Theme and style elements deconstruction
  const {
    Layout,
    Fonts,
    Gutters,
    Containers: { authClinicianSelection, auth },
  } = useTheme()
  const dispatch = useDispatch()

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

  const handleClinician = async clinician => {
    await dispatch(ChangeClinician.action({ clinician }))
    navigateAndSimpleReset('Pin')
  }

  return (
    <View style={auth.wrapper}>
      <Animated.View style={auth.animation(fadeAnim)}>
        <Text style={auth.header}>Select clinician</Text>
        <View style={[Layout.fill, Layout.left]}>
          {healthFacility.medical_staffs.map(clinician => {
            return (
              <TouchableOpacity
                key={clinician.id}
                style={[
                  Gutters.tinyVMargin,
                  Gutters.regularVPadding,
                  Gutters.regularHPadding,
                  { elevation: 1 },
                ]}
                onPress={() => handleClinician(clinician)}
              >
                <Text style={[Fonts.textColorText, Fonts.textSmall]}>
                  {clinician.first_name} {clinician.last_name}
                </Text>
                <Text style={[Fonts.textColorText]}>{clinician.role}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </Animated.View>
    </View>
  )
}

export default ClinicianSelectionAuthContainer
