/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

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

  const syncLoading = useSelector(state => state.synchronization.loading)
  const [unSynced, setUnSynced] = useState([])

  useEffect(async () => {
    if (syncLoading) {
      const result = await GetNonSynchronizedService()
      setUnSynced(result)
    }
  }, [syncLoading])

  /**
   * Handles the synchronization action
   */
  const handleSynchronization = () => {
    dispatch(Synchronize.action())
  }

  return (
    <View style={[Layout.fill, Layout.row]}>
      <View style={bottomNavbar.actionButton}>
        <SquareButton
          label={t('containers.synchronization.synchronize')}
          filled
          onPress={handleSynchronization}
          disabled={syncLoading || unSynced.length === 0}
        />
      </View>
    </View>
  )
}

export default SynchronizationNavbar
