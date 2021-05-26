/**
 * The external imports
 */
import React from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { SquareButton } from '@/Components'

const SynchronizationNavbar = props => {
  // Theme and style elements deconstruction
  const {
    Components: { bottomNavbar },
    Layout,
  } = useTheme()

  const { t } = useTranslation()

  /**
   *
   * @param {integer} direction :
   */
  const handleSynchronization = () => {
    console.log('TODO SYNCHRO')
  }

  return (
    <View style={[Layout.fill, Layout.row]}>
      <View style={bottomNavbar.actionButton}>
        <SquareButton
          label={t('containers.synchronization.synchronize')}
          filled
          onPress={() => handleSynchronization()}
        />
      </View>
    </View>
  )
}

export default SynchronizationNavbar
