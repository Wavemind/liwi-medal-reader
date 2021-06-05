/**
 * The external imports
 */
import React from 'react'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import SquareButton from '@/Components/Buttons/SquareButton'
import { useTheme } from '@/Theme'

const Lock = () => {
  // Theme and style elements deconstruction
  const {
    Colors,
    Components: { modal },
  } = useTheme()

  const { t } = useTranslation()

  /**
   * TODO
   */
  const handleForceUnlock = () => {
    console.log('force unlock')
  }

  /**
   * TODO
   */
  const handleSummary = () => {
    console.log('summary')
  }

  return (
    <View>
      <Text style={modal.header}>{t('components.modals.lock.title')}</Text>
      <Text style={modal.body}>{t('components.modals.lock.content', { name: 'Jean Neige' })}</Text>

      <View style={modal.buttonWrapper}>
        <SquareButton
          label={t('components.modals.lock.unlockButton')}
          filled
          onPress={handleForceUnlock}
          bgColor={Colors.red}
          fullWidth={false}
        />
        <SquareButton
          label={t('components.modals.lock.summaryButton')}
          filled
          onPress={handleSummary}
          bgColor={Colors.grey}
          fullWidth={false}
        />
      </View>
    </View>
  )
}

export default Lock
