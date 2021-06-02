/**
 * The external imports
 */
import React from 'react'
import { View, Text } from 'react-native'

/**
 * The internal imports
 */
import SquareButton from '../../Buttons/SquareButton'
import { useTheme } from '@/Theme'
import { navigate } from '@/Navigators/Root'
import ToggleVisbility from '@/Store/Modal/ToggleVisibility'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

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
    await dispatch(ToggleVisbility.action({}))
    navigate('Emergency')
  }

  return (
    <View>
      <Text style={modal.header}>{t('modals.emergency.title')}</Text>
      <Text style={modal.body}>{t('modals.emergency.content')}</Text>

      <View style={modal.buttonWrapper}>
        <SquareButton
          label={t('modals.emergency.emergencyButton')}
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
