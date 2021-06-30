/**
 * The external imports
 */
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { WebView } from 'react-native-webview'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const IndexEmergencyContainer = ({ navigation }) => {
  const { t } = useTranslation()

  const emergencyContent = useSelector(state => state.emergency.content)

  // Theme and style elements deconstruction
  const {
    Containers: { emergency },
  } = useTheme()

  return (
    <View style={emergency.wrapper}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={emergency.closeButton}
      >
        <Text style={emergency.closeButtonText}>{t('actions.continue')}</Text>
      </TouchableOpacity>
      <View style={emergency.contentWrapper}>
        <View style={emergency.innerWrapper}>
          <WebView
            source={{ html: emergencyContent }}
            scalesPageToFit={false}
          />
        </View>
      </View>
    </View>
  )
}

export default IndexEmergencyContainer
