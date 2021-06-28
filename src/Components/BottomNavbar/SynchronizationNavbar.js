/**
 * The external imports
 */
import React, { useState } from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

/**
 * The internal imports
 */
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

  const synchLoading = useSelector(state => state.synchronization.loading)
  const medicalCases = useSelector(
    state => state.databaseMedicalCase.getAll.item.data,
  )

  const [unSynced] = useState(
    medicalCases.filter(medicalCase => medicalCase.synchronizedAt === 0),
  )

  /**
   * Handles the synchronization action
   */
  const handleSynchronization = async () => {
    await dispatch(Synchronize.action())
  }

  return (
    <View style={[Layout.fill, Layout.row]}>
      <View style={bottomNavbar.actionButton}>
        <SquareButton
          label={t('containers.synchronization.synchronize')}
          filled
          onPress={handleSynchronization}
          disabled={synchLoading || unSynced.length === 0}
        />
      </View>
    </View>
  )
}

export default SynchronizationNavbar
