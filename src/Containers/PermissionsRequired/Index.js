import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@/Theme'
import { useDispatch } from 'react-redux'
import InitStartup from '@/Store/Startup/Init'

const IndexPermissionsRequiredContainer = () => {
  const { Layout } = useTheme()

  const { t } = useTranslation()

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(InitStartup.action())
  }, [dispatch])

  return (
    <View style={[Layout.fill, Layout.colCenter]}>
      <Text>{t('permissions.message')}</Text>
      <Text>{t('permissions.instructions')}</Text>
    </View>
  )
}

export default IndexPermissionsRequiredContainer