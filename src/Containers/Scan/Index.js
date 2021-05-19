/**
 * The external imports
 */
import React, { useState } from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { View, Text, Dimensions } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const IndexScanContainer = props => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Layout,
    Containers: { scan },
  } = useTheme()
  const { navigation } = props

  const healthFacility = useSelector(state => state.healthFacility.item)

  // Local state definition
  const [generateNewQR, setGenerateNewQR] = useState(false)
  const [otherQR, setOtherQR] = useState(null)

  /**
   * Parse TIMCI QR code data because they didn't want to use the existing format just to piss us off
   * @param QRData : String value coming from QRCODE
   * @returns {{uid: number, group_id: number, study_id}} : Formated data
   */
  const parseHeleneQR = QRData => {
    const regexStudy = /^[IKMST]/
    const regexGroup = /\d{4}/g

    const study_id = QRData.match(regexStudy)[0]
    const digits = [...QRData.matchAll(regexGroup)].flat()

    return {
      study_id,
      group_id: parseInt(digits[0]),
      uid: parseInt(digits[1]),
    }
  }

  /**
   * Handle scan process
   * TODO: TO FINISH !
   */
  const handleScan = async e => {
    let QRData = null

    // Data example : T-F0049-P0002
    const regexHelene = /^[IKMST](-F)\d{4}(-P)\d{4}$/

    if (e.data.match(regexHelene)) {
      QRData = parseHeleneQR(e.data)
    } else {
      try {
        QRData = await JSON.parse(e.data)
      } catch (e) {
        // TODO NOTIFICATION: WRONG FACILITY
      }
    }

    if (_.isEqual(otherQR, QRData)) {
      return
    }

    // QR code valid ?
    if ('uid' in QRData && 'study_id' in QRData && 'group_id' in QRData) {
      const sameFacility = healthFacility.id === parseInt(QRData.group_id)

      const patient = sameFacility
        ? await database.findBy('Patient', QRData.uid, 'uid')
        : await database.findBy('Patient', QRData.uid, 'other_uid')

      if (patient !== null) {
        navigation.navigate('PatientProfile', {
          id: patient.id,
        })
      }
      // Correct facility but patient does not exist
      else if (sameFacility) {
        navigation.navigate('PatientUpsert', {
          idPatient: null,
          newMedicalCase: true,
          facility: {
            ...QRData,
          },
          otherFacility: otherQR,
        })
      } else if (generateNewQR) {
        // TODO NOTIFICATION: new sticker but wrong facility
      }
      // Another medical center
      else {
        // We give him another QR sticker
        setGenerateNewQR(true)
        setOtherQR(QRData)
        // TODO NOTIFICATION: new sticker
      }
    }
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
          <View style={scan.titleWrapper}>
            <Text style={scan.title}>{t('containers.scan.scan')}</Text>
          </View>

          <View style={Layout.row}>
            <View style={scan.leftScan} />

            <View style={scan.centerScan}>
              <Icon name="qr-scan" size={WIDTH * 0.5} />
            </View>

            <View style={scan.rightScan} />
          </View>

          <View style={scan.bottomWrapper}>
            {generateNewQR && (
              <View style={scan.errorWrapper}>
                <Text style={scan.errorTitle}>{t('containers.scan.new')}</Text>
              </View>
            )}
          </View>
        </View>
      }
    />
  )
}

export default IndexScanContainer
