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
   * Will navigate to the next step / Stage base on the current navigation state synchronization
   * @param {integer} direction : tell where we wanna navigate a positive number means we are going forwards and a negative number means we are going back
   */
  const handleSynchronization = direction => {
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
