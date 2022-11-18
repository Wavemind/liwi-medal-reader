/**
 * The external imports
 */
import React, { useRef, useCallback, useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Vibration,
  ActivityIndicator,
} from 'react-native'
import { useCameraDevices, Camera } from 'react-native-vision-camera'
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { isFulfilled } from '@reduxjs/toolkit'
import isEqual from 'lodash/isEqual'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Loader, Icon } from '@/Components'
import HandleQr from '@/Store/Scan/HandleQr'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import CreatePatient from '@/Store/Patient/Create'
import LoadPatient from '@/Store/Patient/Load'
import { formatDate } from '@/Utils/Date'
import { wp } from '@/Theme/Responsive'

const IndexScanContainer = () => {
  const cameraRef = useRef(null)
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const navigation = useNavigation()
  const { t } = useTranslation()

  // Theme and style elements deconstruction
  const {
    Layout,
    Containers: { scan },
  } = useTheme()

  // Local state definition
  const [generateNewQR, setGenerateNewQR] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [otherQR, setOtherQR] = useState({})
  const [barcode, setBarcode] = useState('')
  const [_isCameraInitialized, setIsCameraInitialized] = useState(false)

  // Get values from the store
  const algorithm = useSelector(state => state.algorithm.item)
  const healthFacility = useSelector(state => state.healthFacility.item)
  const scanData = useSelector(state => state.scan.item)
  const handleQrError = useSelector(state => state.scan.handleQr.error)
  const medicalCaseError = useSelector(state => state.medicalCase.create.error)
  const patientLoadError = useSelector(state => state.patient.load.error)

  // Camera config
  const devices = useCameraDevices()
  const device = devices.back
  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  })

  /**
   * Initialize camera on screen focus
   */
  const onInitialized = useCallback(() => {
    setIsCameraInitialized(true)
  }, [isFocused])

  /**
   * Handle camera error
   */
  const onError = useCallback(error => {
    console.error(error)
  }, [])

  /**
   * Toggle QR code activation
   */
  useEffect(() => {
    if (!scanning) {
      toggleActiveState()
    }
    return () => {
      barcodes
    }
  }, [barcodes])

  /**
   * Handles navigation after Scan successful
   */
  useEffect(() => {
    if (scanData.navigate) {
      openMedicalCase()
    }
  }, [scanData])

  /**
   * Retrieves needed data in cas of error. and sets them in local state
   */
  useEffect(() => {
    if (handleQrError?.data) {
      setOtherQR(handleQrError?.data.QRData)
      setGenerateNewQR(handleQrError?.data.generateNewQr)
      setScanning(false)
    }
  }, [handleQrError?.data])

  /**
   * Handle QR scan and process scanning
   */
  const toggleActiveState = async () => {
    if (barcodes && barcodes.length > 0) {
      Vibration.vibrate()
      setScanning(true)
      barcodes.forEach(async scannedBarcode => {
        if (
          scannedBarcode.rawValue !== '' &&
          !isEqual(scannedBarcode.rawValue, barcode)
        ) {
          setBarcode(scannedBarcode.rawValue)
          await dispatch(
            HandleQr.action({
              QrRawData: scannedBarcode.rawValue,
              healthFacilityId: healthFacility.id,
              generateNewQR,
              otherQR,
            }),
          )
        }
      })
    }
  }

  /**
   * Will navigate to the medical case with the appropriate params
   */
  const openMedicalCase = async () => {
    if (scanData.navigationParams.newMedicalCase) {
      const patientResult = await dispatch(
        CreatePatient.action({ ...scanData.navigationParams }),
      )
      if (isFulfilled(patientResult)) {
        const medicalCaseResult = await dispatch(
          CreateMedicalCase.action({
            algorithm,
            patientId: patientResult.payload.id,
          }),
        )
        if (isFulfilled(medicalCaseResult)) {
          navigation.navigate('Main', {
            screen: 'StageWrapper',
            ...scanData.navigationParams,
          })
        }
      }
    } else {
      // Load patient in store
      const loadPatientResult = await dispatch(
        LoadPatient.action({
          patientId: scanData.navigationParams.patientId,
        }),
      )

      if (isFulfilled(loadPatientResult)) {
        navigation.navigate('PatientProfile', {
          title: `${loadPatientResult.payload.first_name} ${
            loadPatientResult.payload.last_name
          } - ${formatDate(loadPatientResult.payload.birth_date)}`,
        })
      }
    }
  }

  if (device == null) {
    return <Loader />
  }

  return (
    <>
      <Camera
        ref={cameraRef}
        device={device}
        onError={onError}
        style={StyleSheet.absoluteFill}
        isActive={isFocused}
        onInitialized={onInitialized}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
      />
      <View style={scan.wrapper}>
        <View style={scan.titleWrapper(handleQrError)}>
          <Text style={scan.title}>{t('containers.scan.scan')}</Text>
        </View>

        <View style={Layout.row}>
          <View style={scan.sideScan(handleQrError)} />

          <View style={scan.centerScan}>
            <Icon name="qr-scan" size={wp(50)} />
          </View>

          <View style={scan.sideScan(handleQrError)} />
        </View>

        <View style={scan.bottomWrapper(handleQrError)}>
          {scanning && <ActivityIndicator size="large" />}
          {(handleQrError || medicalCaseError || patientLoadError) && (
            <View style={scan.errorWrapper}>
              {handleQrError && (
                <Text style={scan.errorTitle}>{handleQrError.message}</Text>
              )}
              {medicalCaseError && (
                <Text style={scan.errorTitle}>{medicalCaseError.message}</Text>
              )}
              {patientLoadError && (
                <Text style={scan.errorTitle}>{patientLoadError.message}</Text>
              )}
            </View>
          )}
        </View>
      </View>
    </>
  )
}

export default IndexScanContainer
