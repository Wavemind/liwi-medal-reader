/**
 * The external imports
 */
import React, { useEffect, useState, useRef } from 'react'
import PINCode from '@haskkor/react-native-pincode'
import { View, Text, Animated, KeyboardAvoidingView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { isFulfilled } from '@reduxjs/toolkit'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import FetchOneAlgorithm from '@/Store/Algorithm/FetchOne'
import { navigateAndSimpleReset } from '@/Navigators/Root'
import { useTheme } from '@/Theme'
import ToggleSwitch from '@/Components/ToggleSwitch'
import Loader from '@/Components/Loader'

const PinAuthContainer = () => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Containers: { auth, authPin },
  } = useTheme()

  // Local state definition
  const [status, setStatus] = useState('initial')

  // Get values from the store
  const fadeAnim = useRef(new Animated.Value(0)).current
  const healthFacility = useSelector(state => state.healthFacility.item)
  const currentClinician = useSelector(state => state.healthFacility.clinician)
  const algorithm = useSelector(state => state.algorithm.item)
  const algorithmFetchOneLoading = useSelector(
    state => state.algorithm.fetchOne.loading,
  )
  const algorithmFetchOneError = useSelector(
    state => state.algorithm.fetchOne.error,
  )

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
    <KeyboardAvoidingView behavior="height" style={auth.wrapper}>
      <Animated.View style={auth.animation(fadeAnim)}>
        <Text style={auth.header}>
          {currentClinician.first_name} {currentClinician.last_name}
          {'\n'}
          <Text style={authPin.secondTitle}>
            {t(`health_facility.roles.${currentClinician.role}`)}
          </Text>
        </Text>
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
            titleComponent={() =>
              algorithmFetchOneLoading ? (
                <Loader height={100} />
              ) : (
                <Text style={authPin.title}>
                  {t('containers.auth.pin.unlock')}
                </Text>
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
            stylePinCodeDeleteButtonSize={35}
            stylePinCodeDeleteButtonText={authPin.delete}
            stylePinCodeRowButtons={authPin.codeButtons}
            stylePinCodeColumnButtons={{}}
            stylePinCodeMainContainer={{}}
            stylePinCodeColumnDeleteButton={{}}
            stylePinCodeButtonCircle={{}}
          />
        </View>

        <View style={auth.themeToggleWrapper}>
          <ToggleSwitch label={t('application.theme.dark_mode')} />
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  )
}

export default PinAuthContainer