/**
 * The external imports
 */
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { WebView } from 'react-native-webview'
import { translate } from '@/Translations/algorithm'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import {
  navigateNestedAndSimpleReset,
  navigateAndSimpleReset,
} from '@/Navigators/Root'

const IndexStudyContainer = ({
  navigation,
  route: {
    params: { source },
  },
}) => {
  const { t } = useTranslation()

  const studyDescription = useSelector(
    state => state.algorithm.item.study.description,
  )

  // Theme and style elements deconstruction
  const {
    Containers: { study },
  } = useTheme()

  const htmlContent =
    translate(studyDescription) !== ''
      ? translate(studyDescription)
      : t('components.modals.study.no_content')

  /**
   * Manages the navigation when the "Continue" button is pressed
   */
  const handlePress = () => {
    if (source === 'auth') {
      navigateNestedAndSimpleReset('Auth', 'ClinicianSelection')
    } else {
      if (navigation.canGoBack()) {
        navigation.goBack()
      } else {
        navigateAndSimpleReset('Home')
      }
    }
  }

  return (
    <View style={study.wrapper}>
      <TouchableOpacity onPress={handlePress} style={study.closeButton}>
        <Text style={study.closeButtonText}>{t('actions.continue')}</Text>
      </TouchableOpacity>
      <View style={study.contentWrapper}>
        <View style={study.innerWrapper}>
          <WebView
            source={{ html: htmlContent }}
            scalesPageToFit={false}
            style={study.bgTransparent}
          />
        </View>
      </View>
    </View>
  )
}

export default IndexStudyContainer
