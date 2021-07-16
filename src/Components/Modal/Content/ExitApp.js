/**
 * The external imports
 */
import React from 'react'
import { View, Text, BackHandler } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

/**
 * The internal imports
 */
import { SquareButton } from '@/Components'
import { useTheme } from '@/Theme'
import ToggleVisibility from '@/Store/Modal/ToggleVisibility'

const ExitApp = () => {
  // Theme and style elements deconstruction
  const {
    Colors,
    Components: { modal },
  } = useTheme()

  const dispatch = useDispatch()
  const { t } = useTranslation()

  /**
   * Close modal and close app
   */
  const closeApp = async () => {
    await dispatch(ToggleVisibility.action({}))
    BackHandler.exitApp()
  }

  /**
   * Close modal
   */
  const closeModal = async () => {
    await dispatch(ToggleVisibility.action({}))
  }

  return (
    <View>
      <Text style={modal.header}>{t('components.modals.exit_app.title')}</Text>
      <Text style={modal.body}>{t('components.modals.exit_app.content')}</Text>

      <View style={modal.buttonWrapper}>
        <SquareButton
          label={t('components.modals.exit_app.ok')}
          filled
          onPress={closeApp}
          bgColor={Colors.grey}
          color={Colors.white}
          fullWidth={false}
        />
        <SquareButton
          label={t('components.modals.exit_app.back')}
          filled
          onPress={closeModal}
          bgColor={Colors.primary}
          fullWidth={false}
        />
      </View>
    </View>
  )
}

export default ExitApp
