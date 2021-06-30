/**
 * The external imports
 */
import 'react-native'

/**
 * The internal imports
 */
import { HandleQrService } from '@/Services/Scan'

// Define global testing variables
const healthFacilityId = 7
const QrRawData =
  '{"study_id":"Dynamic Tanzania","group_id":"7","uid":"e1a56e66-613c-49f7-9905-31e1e8943af0"}'

const otherHealthFacilityId = 10
const otherQrRawData =
  '{"study_id":"Dynamic Tanzania","group_id":"10","uid":"e1a56e66-613c-49f7-9905-31e1e8943af0"}'

describe('Scan QR code properly ', () => {
  it('should handle a QR code from Dynamic TZ properly', async () => {
    const result = await HandleQrService({
      QrRawData: otherQrRawData,
      healthFacilityId: otherHealthFacilityId,
      generateNewQR: false,
      otherQR: {},
    })
    expect(result).toStrictEqual({
      navigate: true,
      navigationParams: {
        facility: {
          group_id: '10',
          study_id: 'Dynamic Tanzania',
          uid: 'e1a56e66-613c-49f7-9905-31e1e8943af0',
        },
        patientId: null,
        newMedicalCase: true,
        otherFacility: {},
      },
    })
  })

  it('should handle a QR code that has not the correct format', async () => {
    const notAQrCode = 'I am not a QR CODE'
    try {
      await HandleQrService({
        QrRawData: notAQrCode,
        healthFacilityId: otherHealthFacilityId,
        generateNewQR: false,
        otherQR: {},
      })
    } catch (e) {
      expect(e).toEqual({
        message: 'The QR code does not have the correct format',
        status: 'error',
      })
    }
  })

  it('should handle a QR code that is from another facility', async () => {
    try {
      await HandleQrService({
        QrRawData: otherQrRawData,
        healthFacilityId,
        generateNewQR: false,
        otherQR: {},
      })
    } catch (e) {
      expect(e).toEqual({
        data: {
          QRData: {
            group_id: '10',
            study_id: 'Dynamic Tanzania',
            uid: 'e1a56e66-613c-49f7-9905-31e1e8943af0',
          },
          generateNewQr: true,
        },
        status: 'error',
        message: 'You need to give another sticker to the patient',
      })
    }
  })

  it('should handle a QR code that is given to a patient that comes from another Health facility', async () => {
    const result = await HandleQrService({
      QrRawData,
      healthFacilityId,
      generateNewQR: true,
      otherQR: {
        group_id: '10',
        study_id: 'Dynamic Tanzania',
        uid: 'e1a56e66-613c-49f7-9905-31e1e8943af0',
      },
    })
    expect(result).toStrictEqual({
      navigate: true,
      navigationParams: {
        facility: {
          group_id: '7',
          study_id: 'Dynamic Tanzania',
          uid: 'e1a56e66-613c-49f7-9905-31e1e8943af0',
        },
        patientId: null,
        newMedicalCase: true,
        otherFacility: {
          group_id: '10',
          study_id: 'Dynamic Tanzania',
          uid: 'e1a56e66-613c-49f7-9905-31e1e8943af0',
        },
      },
    })
  })

  it('should handle a wring QR code that is given to a patient that comes from another Health facility', async () => {
    const unknownQrRawData =
      '{"study_id":"Dynamic Tanzania","group_id":"8","uid":"e1a56e66-613c-49f7-9905-31e1e8943af0"}'
    try {
      await HandleQrService({
        QrRawData: unknownQrRawData,
        healthFacilityId,
        generateNewQR: true,
        otherQR: {
          group_id: '10',
          study_id: 'Dynamic Tanzania',
          uid: 'e1a56e66-613c-49f7-9905-31e1e8943af0',
        },
      })
    } catch (e) {
      expect(e).toEqual({
        status: 'error',
        message: 'The new sticker does not belong to your facility',
      })
    }
  })
})
