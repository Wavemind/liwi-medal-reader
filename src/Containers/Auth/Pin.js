/**
 * The external imports
 */
import React, { useEffect, useState, useRef } from 'react'
import PINCode from '@haskkor/react-native-pincode'
import { View, Text, Animated } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { isFulfilled } from '@reduxjs/toolkit'
import { useTranslation } from 'react-i18next'
import { heightPercentageToDP } from 'react-native-responsive-screen'
import { HF_TOKEN } from 'env'
import * as Keychain from 'react-native-keychain'

/**
 * The internal imports
 */
import FetchOneAlgorithm from '@/Store/Algorithm/FetchOne'
import FetchOneEmergency from '@/Store/Emergency/FetchOne'
import ChangeVersion from '@/Store/System/ChangeVersion'
import {
  navigateAndSimpleReset,
  navigateNestedAndSimpleReset,
} from '@/Navigators/Root'
import { useTheme } from '@/Theme'
import { fadeIn } from '@/Theme/Animation'
import { ToggleSwitchDarkMode, Loader, SquareButton } from '@/Components'

const PinAuthContainer = () => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Colors,
    Layout,
    Containers: { auth, authPin, global },
  } = useTheme()

  // Local state definition
  const [status, setStatus] = useState('initial')
  const [messageTypes, setMessageTypes] = useState([])
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
  const emergencyContentFetchOneError = useSelector(
    state => state.emergency.emergency.error,
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
    setMessageTypes([])

    if (value === pinCode) {
      setLoading(true)
      setMessageTypes(prev => [...prev, 'retrieving_algorithm'])

      const result = await dispatch(
        FetchOneAlgorithm.action({ json_version: algorithm.json_version }),
      )

      if (isFulfilled(result)) {
        setMessageTypes(prev => [
          ...prev,
          result.payload.updated ? 'new_algorithm' : 'no_change_algorithm',
        ])

        setMessageTypes(prev => [...prev, 'retrieving_emergency_content'])
        await dispatch(
          FetchOneEmergency.action({
            emergencyContentVersion: emergencyContentVersion,
            algorithmId: result.payload.algorithm_id,
          }),
        )
        setMessageTypes(prev => [
          ...prev,
          result.payload.updated
            ? 'new_emergency_content'
            : 'no_change_emergency_content',
        ])
        await dispatch(
          ChangeVersion.action({
            newVersionId: result.payload.version_id,
          }),
        )
        setLoading(false)

        if (
          medicalCase.id &&
          medicalCase.closedAt === 0 &&
          medicalCase.version_id === algorithm.version_id
        ) {
          navigateNestedAndSimpleReset('Main', 'StageWrapper', {
            stageIndex: medicalCase.advancement.stage,
            stepIndex: medicalCase.advancement.step,
          })
        } else {
          navigateAndSimpleReset('Main')
        }
      } else {
        setStatus('failure')
        setLoading(false)
      }
    } else {
      setStatus('failure')
    }
  }

  const enrollDevice = async () => {
    // Remove tokens
    await Keychain.resetInternetCredentials('accessToken')
    await Keychain.resetInternetCredentials('accessTokenExpirationDate')
    await Keychain.resetInternetCredentials('refreshToken')

    navigateAndSimpleReset('Auth', { screen: 'Login' })
  }

  return (
    <Animated.View style={[global.animation(fadeAnim), global.wrapper]}>
      <View style={[Layout.fill, Layout.justifyContentBetween]}>
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

        {algorithmFetchOneError === '' && emergencyContentFetchOneError && (
          <Text style={auth.errorMessage}>
            {emergencyContentFetchOneError.message}
          </Text>
        )}

        {(algorithmFetchOneError || emergencyContentFetchOneError) &&
          !loading && (
            <SquareButton label="Connect" filled onPress={enrollDevice} />
          )}
      </View>

      {!(algorithmFetchOneError || emergencyContentFetchOneError) ||
        (loading && (
          <View style={authPin.messageWrapper}>
            {messageTypes.map(messageType => (
              <Text style={authPin.secondTitle} key={messageType}>
                {t(`containers.auth.pin.${messageType}`)}
              </Text>
            ))}
          </View>
        ))}
      <View style={authPin.wrapper}>
        <PINCode
          passwordLength={pinCode?.length}
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
  )
}

export default PinAuthContainer
