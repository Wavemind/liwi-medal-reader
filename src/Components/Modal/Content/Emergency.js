/**
 * The external imports
 */
import React from 'react'
import { View, Text } from 'react-native'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { SquareButton } from '@/Components'
import { useTheme } from '@/Theme'
import { navigate } from '@/Navigators/Root'
import ToggleVisibility from '@/Store/Modal/ToggleVisibility'

const Emergency = () => {
  // Theme and style elements deconstruction
  const {
    Colors,
    Components: { modal },
  } = useTheme()

  const dispatch = useDispatch()

  const { t } = useTranslation()

  /**
   * Toggle the modal visibility and navigates to the emergency page
   * @returns {Promise<void>}
   */
  const handleOnPress = async () => {
    await dispatch(ToggleVisibility.action({}))
    navigate('Emergency')
  }

  return (
    <View>
      <Text style={modal.header}>{t('components.modals.emergency.title')}</Text>
      <Text style={modal.body}>{t('components.modals.emergency.content')}</Text>

      <View style={modal.buttonWrapper}>
        <SquareButton
          label={t('components.modals.emergency.emergencyButton')}
          filled
          onPress={handleOnPress}
          bgColor={Colors.red}
          fullWidth={false}
        />
      </View>
    </View>
  )
}

export default Emergency
