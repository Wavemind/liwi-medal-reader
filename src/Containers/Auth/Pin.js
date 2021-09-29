/**
 * The external imports
 */
import React, { useEffect, useState, useRef } from 'react'
import PINCode from '@haskkor/react-native-pincode'
import { View, Text, Animated, KeyboardAvoidingView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { isFulfilled } from '@reduxjs/toolkit'
import { useTranslation } from 'react-i18next'
import { heightPercentageToDP } from 'react-native-responsive-screen'
import { HF_TOKEN } from 'env'
/**
 * The internal imports
 */
import FetchOneAlgorithm from '@/Store/Algorithm/FetchOne'
import FetchOneEmergency from '@/Store/Emergency/FetchOne'
import ChangeVersion from '@/Store/System/ChangeVersion'
import {
  navigateAndSimpleReset,
  navigateToMedicalCase,
} from '@/Navigators/Root'
import { useTheme } from '@/Theme'
import { fadeIn } from '@/Theme/Animation'
import { ToggleSwitchDarkMode, Loader } from '@/Components'

const PinAuthContainer = () => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Colors,
    Containers: { auth, authPin, global },
  } = useTheme()

  // Local state definition
  const [status, setStatus] = useState('initial')
  const [loading, setLoading] = useState(false)

  // Get values from the store
  const fadeAnim = useRef(new Animated.Value(0)).current
  const pinCode = useSelector(state => state.healthFacility.item.pin_code)
  const currentClinician = useSelector(state => state.healthFacility.clinician)
  const medicalCase = useSelector(state => state.medicalCase.item)
  const emergencyContentVersion = useSelector(
    state => state.emergency.item.emergency_content_version,
  )
  const algorithm = useSelector(state => state.algorithm.item)
  const algorithmFetchOneError = useSelector(
    state => state.algorithm.fetchOne.error,
  )
  const dispatch = useDispatch()

  useEffect(() => {
    fadeIn(fadeAnim)

    if (__DEV__) {
      handlePin(HF_TOKEN)
    }
  }, [fadeAnim])

  /**
   * Manages the pin entry and navigation if pin is correct
   * @param pinCode
   * @returns {}
   */
  const handlePin = async value => {
    if (value === pinCode) {
      setLoading(true)

      const result = await dispatch(
        FetchOneAlgorithm.action({ json_version: algorithm.json_version }),
      )

      if (isFulfilled(result)) {
        await dispatch(
          FetchOneEmergency.action({
            emergencyContentVersion: emergencyContentVersion,
            algorithmId: result.payload.algorithm_id,
          }),
        )

        await dispatch(
          ChangeVersion.action({
            newVersionId: result.payload.version_id,
          }),
        )
        setLoading(false)
        if (medicalCase.id && medicalCase.closedAt === 0) {
          navigateToMedicalCase(medicalCase)
        } else {
          navigateAndSimpleReset('Home')
        }
      }
    } else {
      setLoading(false)
      setStatus('failure')
    }
  }

  return (
    <KeyboardAvoidingView behavior="height" style={global.wrapper}>
      <Animated.View style={global.animation(fadeAnim)}>
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
            passwordLength={pinCode.length}
            endProcessFunction={handlePin}
            disableLockScreen
            status="enter"
            pinStatus={status}
            titleComponent={() =>
              loading ? (
                <Loader height={Math.round(heightPercentageToDP(11))} />
              ) : (
                <Text style={authPin.title}>
                  {t('containers.auth.pin.unlock')}
                </Text>
              )
            }
            storedPin={pinCode}
            buttonDeleteText={t('containers.auth.pin.delete')}
            colorCircleButtons={Colors.grey}
            colorPassword={Colors.red}
            stylePinCodeButtonNumber={Colors.secondary}
            numbersButtonOverlayColor={Colors.red}
            stylePinCodeDeleteButtonColorShowUnderlay={Colors.red}
            stylePinCodeDeleteButtonColorHideUnderlay={Colors.grey}
            stylePinCodeColorTitle={Colors.red}
            stylePinCodeDeleteButtonSize={Math.round(heightPercentageToDP(3.8))}
            stylePinCodeDeleteButtonText={authPin.delete}
            stylePinCodeRowButtons={authPin.codeButtons}
          />
        </View>

        <View style={auth.themeToggleWrapper}>
          <ToggleSwitchDarkMode label={t('application.theme.dark_mode')} />
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  )
}

export default PinAuthContainer
