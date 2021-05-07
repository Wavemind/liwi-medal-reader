/**
 * The external imports
 */
import React from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { translate } from '@/Translations/algorithm'

function Study() {
  // Theme and style elements deconstruction
  const { t } = useTranslation()

  const {
    Containers: { modalAlgorithm },
  } = useTheme()

  const studyDescription = useSelector(
    state => state.algorithm.item.study.description,
  )

  const htmlContent =
    translate(studyDescription) !== ''
      ? translate(studyDescription)
      : t('components.modal.study.no_content')

  return (
    <View style={modalAlgorithm.wrapper}>
      <WebView source={{ html: htmlContent }} scalesPageToFit={false} />
    </View>
  )
}

export default Study
