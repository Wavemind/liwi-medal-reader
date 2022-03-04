/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

/**
 * The internal imports
 */
import { GetNonSynchronizedService } from '@/Services/MedicalCase'
import { useTheme } from '@/Theme'
import { SquareButton } from '@/Components'
import Synchronize from '@/Store/Synchronization/Synchronize'

const SynchronizationNavbar = () => {
  // Theme and style elements deconstruction
  const {
    Components: { bottomNavbar },
    Layout,
  } = useTheme()

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [unSynced, setUnSynced] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setNonSynchronized()
  }, [])

  /**
   * Needed to know if there is un sync case remaining
   */
  useEffect(() => {
    if (loading) {
      setNonSynchronized()
    }
  }, [loading])

  /**
   * Fetch non synchronized case and save it in local state
   */
  const setNonSynchronized = async () => {
    const result = await GetNonSynchronizedService()
    setUnSynced(result)
  }

  /**
   * Handles the synchronization action
   */
  const handleSynchronization = async () => {
    const groupedMedicalCases = []
    let subMedicalCases = []
    setLoading(true)
    unSynced.forEach((medicalCase, index) => {
      subMedicalCases.push(medicalCase)
      if ((index + 1) % 5 === 0 || index === unSynced.length - 1) {
        groupedMedicalCases.push(subMedicalCases)
        subMedicalCases = []
      }
    })
    await groupedMedicalCases.forEach((medicalCases, index) => {
      setTimeout(() => {
        dispatch(Synchronize.action(medicalCases))
      }, 2000 * index)
    })
    setLoading(false)
  }

  return (
    <View style={[Layout.fill, Layout.row]}>
      <View style={bottomNavbar.actionButton}>
        <SquareButton
          label={t('containers.synchronization.synchronize')}
          filled
          onPress={handleSynchronization}
          disabled={loading || unSynced.length === 0}
        />
      </View>
    </View>
  )
}

export default SynchronizationNavbar
