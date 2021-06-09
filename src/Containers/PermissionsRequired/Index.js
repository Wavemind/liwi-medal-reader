/**
 * The external imports
 */
import React from 'react'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const IndexPermissionsRequiredContainer = () => {
  const { Layout, Fonts, Gutters } = useTheme()
  const { t } = useTranslation()

  return (
    <View style={[Layout.fill, Layout.colCenter, Gutters.largeHMargin]}>
      <Text style={[Fonts.titleRegular, Fonts.textCenter]}>
        {t('permissions.message')}
      </Text>
      <Text style={[Fonts.textRegular, Fonts.textCenter, Gutters.largeTMargin]}>
        {t('permissions.instructions')}
      </Text>
    </View>
  )
}

export default IndexPermissionsRequiredContainer
