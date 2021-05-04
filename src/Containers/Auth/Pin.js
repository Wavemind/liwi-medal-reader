import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Animated, ActivityIndicator } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { isFulfilled } from '@reduxjs/toolkit'
import PINCode from '@haskkor/react-native-pincode'

import FetchOneAlgorithm from '@/Store/Algorithm/FetchOne'
import { navigateAndSimpleReset } from '@/Navigators/Root'
import { useTheme } from '@/Theme'

const PinAuthContainer = props => {
  // Theme and style elements deconstruction
  const { Layout, Fonts } = useTheme()
  const dispatch = useDispatch()

  // Local state definition
  const fadeAnim = useRef(new Animated.Value(0)).current
  const healthFacility = useSelector(state => state.healthFacility.item)
  const algorithm = useSelector(state => state.algorithm.item)
  const algorithmFetchOneLoading = useSelector(
    state => state.algorithm.fetchOne.loading,
  )
  const algorithmFetchOneError = useSelector(
    state => state.algorithm.fetchOne.error,
  )
  const [status, setStatus] = useState('initial')

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])

  const handlePin = async pinCode => {
    if (pinCode === healthFacility.pin_code) {
      const result = await dispatch(
        FetchOneAlgorithm.action({ json_version: algorithm.json_version }),
      )
      if (isFulfilled(result)) {
        navigateAndSimpleReset('ClinicianSelection')
      }
    } else {
      setStatus('failure')
    }
  }

  return (
    <Animated.View style={[Layout.fill, Layout.center, { opacity: fadeAnim }]}>
      <Text style={[Fonts.textColorText, Fonts.titleSmall]}>Pin</Text>
      {algorithmFetchOneError && (
        <Text style={Fonts.textRegular}>{algorithmFetchOneError.message}</Text>
      )}
      <View style={[Layout.fill, Layout.center]}>
        <PINCode
          passwordLength={healthFacility.pin_code.length}
          endProcessFunction={handlePin}
          disableLockScreen
          status="enter"
          pinStatus={status}
          titleComponent={() => (
            <Text size-auto style={[Fonts.textColorText, Fonts.textRegular]}>
              Unlock
            </Text>
          )}
          subtitleComponent={() =>
            algorithmFetchOneLoading && (
              <ActivityIndicator size="large" color="#0000ff" />
            )
          }
          storedPin={healthFacility.pin_code}
          colorCircleButtons="#757575"
          colorPassword="#db473e"
          stylePinCodeButtonNumber="#FFF"
          numbersButtonOverlayColor="#db473e"
          stylePinCodeDeleteButtonColorShowUnderlay="#db473e"
          stylePinCodeDeleteButtonColorHideUnderlay="#757575"
          stylePinCodeColorTitle="#db473e"
          stylePinCodeDeleteButtonSize={30}
          stylePinCodeDeleteButtonText={[Fonts.textSmall]}
          stylePinCodeRowButtons={{
            justifyContent: 'center',
            alignItems: 'center',
            height: 150,
          }}
          stylePinCodeColumnButtons={{}}
          stylePinCodeMainContainer={{}}
          stylePinCodeColumnDeleteButton={{}}
          stylePinCodeButtonCircle={{}}
        />
      </View>
    </Animated.View>
  )
}

export default PinAuthContainer
