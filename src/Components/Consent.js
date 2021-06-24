/**
 * The external imports
 */
import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { SectionHeader, SquareButton, Icon } from '@/Components'
import UpdateField from '@/Store/Patient/UpdateField'

const Consent = props => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const {
    Components: { consent, question, booleanButton },
    Layout,
    Gutters,
    FontSize,
    Colors,
  } = useTheme()

  const patientConsent = useSelector(state => state.patient.item.consent)
  const patientConsentFile = useSelector(
    state => state.patient.item.consent_file,
  )
  const consentError = useSelector(state => state.validation.item.consent)

  /**
   * Change the value of the consent in the patient store
   * @param {bool} value : values to set in the store
   */
  const setPatientConsent = async value => {
    await dispatch(UpdateField.action({ field: 'consent', value }))
  }

  return (
    <View style={[Gutters.regularHPadding, Gutters.regularBMargin]}>
      <SectionHeader label={t('components.consent.title')} />
      <View style={question.questionWrapper(false)}>
        <Text style={question.text(consentError ? 'error' : null)}>
          {t('components.consent.question')}
        </Text>
        <View style={[question.inputWrapper, Layout.row]}>
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
          {patientConsentFile && (
            <View style={consent.scanConsentButton}>
              <SquareButton
                label={t('actions.show_consent')}
                onPress={() =>
                  navigation.navigate('Preview', {
                    consent: patientConsentFile,
                  })
                }
                filled
              />
            </View>
          )}
        </View>
      )}
      {consentError && (
        <View style={[question.messageWrapper(consentError ? 'error' : null)]}>
          <Icon
            size={FontSize.regular}
            color={Colors.secondary}
            name="warning"
          />
          <Text style={question.message}>{consentError}</Text>
        </View>
      )}
    </View>
  )
}

export default Consent
