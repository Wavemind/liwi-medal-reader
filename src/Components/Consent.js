/**
 * The external imports
 */
import React, { useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { SectionHeader, SquareButton } from '@/Components'

const Consent = props => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const navigation = useNavigation()
  const {
    Components: { consent, question, booleanButton },
    Layout,
    Gutters,
  } = useTheme()

  // Local state definition
  const [patientConsent, setPatientConsent] = useState(true)

  return (
    <View style={[Gutters.regularHPadding, Gutters.regularBMargin]}>
      <SectionHeader label={t('components.consent.title')} />
      <View style={question.questionWrapper}>
        <Text style={consent.question}>{t('components.consent.question')}</Text>
        <View style={question.inputWrapper}>
          <View
            key="booleanButton-left"
            style={booleanButton.buttonWrapper('left', patientConsent)}
          >
            <TouchableOpacity
              style={Layout.center}
              onPress={() => setPatientConsent(true)}
            >
              <Text style={booleanButton.buttonText(patientConsent)}>
                {t('answers.yes')}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            key="booleanButton-right"
            style={booleanButton.buttonWrapper(
              'right',
              patientConsent === false,
            )}
          >
            <TouchableOpacity
              style={Layout.center}
              onPress={() => setPatientConsent(false)}
            >
              <Text style={booleanButton.buttonText(patientConsent === false)}>
                {t('answers.no')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {patientConsent && (
        <View style={consent.buttonsWrapper}>
          <View style={consent.showConsentButton}>
            <SquareButton
              label={t('actions.scan_consent')}
              onPress={() => navigation.navigate('Camera')}
            />
          </View>
          {false && (
            <View style={consent.scanConsentButton}>
              <SquareButton
                label={t('actions.show_consent')}
                onPress={() => console.log('TODO: show consent')}
                filled
              />
            </View>
          )}
        </View>
      )}
    </View>
  )
}

export default Consent
