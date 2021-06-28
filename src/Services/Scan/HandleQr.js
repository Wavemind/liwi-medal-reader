import i18n from '@/Translations/index'
import useDatabase from '@/Services/Database/useDatabase'

/**
 * Parse TIMCI QR code data because they didn't want to use the existing format just to piss us off
 * @param QRData : String value coming from QRCODE
 * @returns {{uid: number, group_id: number, study_id}} : Formatted data
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
 * Returns an error in case the QR code structure is unknown
 */
const qrCodeNotValid = () => {
  return Promise.reject({
    message: i18n.t('containers.scan.wrong_format'),
    status: 'error',
  })
}

/**
 * Reads data from the QRScanner and returns an object with the needed information
 * TODO UNIT TEST waiting for alan's testing data with Helene's bullshit
 * @param {*} e
 */
const getQrData = async data => {
  let QRData = null

  // Data example : T-F0049-P0002
  const regexHelene = /^[IKMST](-F)\d{4}(-P)\d{4}$/

  if (data.match(regexHelene)) {
    QRData = parseHeleneQR(data)
  } else {
    try {
      QRData = await JSON.parse(data)
    } catch {
      return qrCodeNotValid()
    }
  }
  return QRData
}

/**
 * Requests the DB to know if the scanned patient is already known in the database
 */
export const SearchPatient = async (QRData, sameFacility) => {
  const { findBy } = useDatabase()
  return sameFacility
    ? findBy('Patient', QRData.uid, 'uid')
    : findBy('Patient', QRData.uid, 'other_uid')
}

export default async ({
  QrRawData,
  healthFacilityId,
  generateNewQR,
  otherQR,
}) => {
  const QRData = await getQrData(QrRawData)
  // QR code valid ?
  if ('uid' in QRData && 'study_id' in QRData && 'group_id' in QRData) {
    const sameFacility = healthFacilityId === parseInt(QRData.group_id)

    const patient = await SearchPatient(QRData, sameFacility)

    if (patient !== null) {
      return {
        navigate: true,
        navigationParams: { patientId: patient.id, newMedicalCase: false },
      }
    } else if (sameFacility) {
      // if it is the correct facility but patient does not exist We create a new patient.
      return {
        navigate: true,
        navigationParams: {
          patientId: null,
          newMedicalCase: true,
          facility: {
            ...QRData,
          },
          otherFacility: otherQR,
        },
      }
    } else if (generateNewQR) {
      return Promise.reject({
        message: i18n.t('containers.scan.new_sticker_wrong_facility'),
        status: 'error',
      })
    }
    // Another medical center
    else {
      return Promise.reject({
        message: i18n.t('containers.scan.new_sticker_notification'),
        data: { QRData, generateNewQr: true },
        status: 'error',
      })
    }
  } else {
    qrCodeNotValid()
  }
}
