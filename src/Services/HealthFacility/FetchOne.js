/**
 * The external imports
 */
import axios from 'axios'

/**
 * The internal imports
 */
import api from '@/Services'
import { Config } from '@/Config'
import { store } from '@/Store'

export default async ({}) => {
  const abort = axios.CancelToken.source()

  const currentHealthFacility = store.getState().healthFacility.item

  const timeout = setTimeout(() => {
    abort.cancel()
    return currentHealthFacility
  }, Config.TIMEOUT)

  let response

  await api.get('health-facility-info').then(result => {
    // Clear The Timeout
    clearTimeout(timeout)
    response = result
  })

  // Early return if health facility change
  if (currentHealthFacility.id !== response.data.id) {
    return response.data
  }

  let medicalStaffs = response.data.medical_staffs

  // Update medical staff
  if (currentHealthFacility.hasOwnProperty('medical_staffs')) {
    medicalStaffs = response.data.medical_staffs.map(newMedicalStaff => {
      const storedMedicalStaff = currentHealthFacility.medical_staffs.find(
        ms => ms.id === newMedicalStaff.id,
      )

      if (storedMedicalStaff) {
        // Existing staff but updated in medAL-c
        if (storedMedicalStaff.updated_at !== newMedicalStaff.updated_at) {
          return {
            ...newMedicalStaff,
            app_language: storedMedicalStaff.app_language,
            algo_language: storedMedicalStaff.algo_language,
          }
        }

        // Same staff
        if (storedMedicalStaff.updated_at === newMedicalStaff.updated_at) {
          return storedMedicalStaff
        }
      } else {
        // New staff
        return newMedicalStaff
      }
    })
  }

  return {
    ...response.data,
    medical_staffs: medicalStaffs,
  }
}
