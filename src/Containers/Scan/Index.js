/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { View, Text, Dimensions } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import * as _ from 'lodash'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'
import createMedicalCase from '@/Store/MedicalCase/create'
import HandleQr from '@/Store/Scan/HandleQr'

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const IndexScanContainer = props => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigation = useNavigation()

  // Theme and style elements deconstruction
  const {
    Layout,
    Containers: { scan },
  } = useTheme()

  // Get values from the store
  const healthFacility = useSelector(state => state.healthFacility.item)
  const algorithm = useSelector(state => state.algorithm.item)
  const medicalCase = useSelector(state => state.medicalCase)
  console.log('medicalCase', medicalCase)
  const {
    item,
    handleQr: { error },
  } = useSelector(state => state.scan)

  // Local state definition
  const [generateNewQR, setGenerateNewQR] = useState(false)
  const [otherQR, setOtherQR] = useState({})
  const [lastScan, setLastScan] = useState({})

  const openMedicalCase = async item => {
    if (item.navigate) {
      // await dispatch(
      //   createMedicalCase.action({
      //     algorithm,
      //   }),
      // )
      navigation.navigate('TODO', item.navigationParams)
    }
  }

  /**
   * Handles navigation after Scan successful
   */
  useEffect(() => {
    openMedicalCase(item)
  }, [item])

  /**
   * Retrieves needed data in cas of error. and sets them in local state
   */
  useEffect(() => {
    if (error?.data) {
      setOtherQR(error?.data.QRData)
      setGenerateNewQR(error?.data.generateNewQr)
    }
  }, [error?.data])

  /**
   * Handle scan process
   */
  const handleScan = async e => {
    // If the QR code is the same as the one that has been scanned before
    if (_.isEqual(lastScan, e.data)) {
      return
    }
    setLastScan(e.data)

    await dispatch(
      HandleQr.action({
        QrRawData: e.data,
        healthFacilityId: healthFacility.id,
        generateNewQR,
        otherQR,
      }),
    )
  }
  return (
    <QRCodeScanner
      showMarker
      vibrate
      reactivate
      reactivateTimeout={2000}
      onRead={handleScan}
      cameraStyle={{ height: HEIGHT }}
      customMarker={
        <View style={scan.wrapper}>
          <View style={scan.titleWrapper(error)}>
            <Text style={scan.title}>{t('containers.scan.scan')}</Text>
          </View>

          <View style={Layout.row}>
            <View style={scan.leftScan(error)} />

            <View style={scan.centerScan}>
              <Icon name="qr-scan" size={WIDTH * 0.5} />
            </View>

            <View style={scan.rightScan(error)} />
          </View>

          <View style={scan.bottomWrapper(error)}>
            {error && (
              <View style={scan.errorWrapper}>
                <Text style={scan.errorTitle}>{error.message}</Text>
              </View>
            )}
          </View>
        </View>
      }
    />
  )
}

export default IndexScanContainer
