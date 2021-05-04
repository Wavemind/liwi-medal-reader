/**
 * The external imports
 */
import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Animated } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { isFulfilled } from '@reduxjs/toolkit'
import PINCode from '@haskkor/react-native-pincode'

/**
 * The internal imports
 */
import FetchOneAlgorithm from '@/Store/Algorithm/FetchOne'
import { navigateAndSimpleReset } from '@/Navigators/Root'
import { useTheme } from '@/Theme'
import ToggleSwitch from '@/Components/ToggleSwitch'

const PinAuthContainer = () => {
  // Theme and style elements deconstruction
  const {
    Containers: { auth, authPin },
  } = useTheme()

  // Local state definition
  const [status, setStatus] = useState('initial')

  // Get values from the store
  const fadeAnim = useRef(new Animated.Value(0)).current
  const healthFacility = useSelector(state => state.healthFacility.item)
  const algorithm = useSelector(state => state.algorithm.item)
  const algorithmFetchOneError = useSelector(state => state.algorithm.fetchOne.error)

  const dispatch = useDispatch()

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])

  /**
   * Manages the pin entry and navigation if pin is correct
   * @param pinCode
   * @returns {Promise<void>}
   */
  const handlePin = async pinCode => {
    if (pinCode === healthFacility.pin_code) {
      const result = await dispatch(
        FetchOneAlgorithm.action({ json_version: algorithm.json_version }),
      )
      if (isFulfilled(result)) {
        navigateAndSimpleReset('Home')
      }
    } else {
      setStatus('failure')
    }
  }

  return (
    <View style={auth.wrapper}>
      <Animated.View style={auth.animation(fadeAnim)}>
        <Text style={auth.header}>Pin</Text>
        {algorithmFetchOneError && (
          <Text style={auth.errorMessage}>
            {algorithmFetchOneError.message}
          </Text>
        )}
        <View style={authPin.wrapper}>
          <PINCode
            passwordLength={healthFacility.pin_code.length}
            endProcessFunction={handlePin}
            disableLockScreen
            status="enter"
            pinStatus={status}
            titleComponent={() => (
              <Text size-auto style={authPin.title}>
                Unlock
              </Text>
            )}
            storedPin={healthFacility.pin_code}
            colorCircleButtons="#757575"
            colorPassword="#db473e"
            stylePinCodeButtonNumber="#FFF"
            numbersButtonOverlayColor="#db473e"
            stylePinCodeDeleteButtonColorShowUnderlay="#db473e"
            stylePinCodeDeleteButtonColorHideUnderlay="#757575"
            stylePinCodeColorTitle="#db473e"
            stylePinCodeDeleteButtonSize={30}
            stylePinCodeDeleteButtonText={authPin.delete}
            stylePinCodeRowButtons={authPin.codeButtons}
            stylePinCodeColumnButtons={{}}
            stylePinCodeMainContainer={{}}
            stylePinCodeColumnDeleteButton={{}}
            stylePinCodeButtonCircle={{}}
          />
        </View>

        <ToggleSwitch label="Dark mode" />
      </Animated.View>
    </View>
  )
}

export default PinAuthContainer
