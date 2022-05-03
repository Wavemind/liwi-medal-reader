/**
 * The external imports
 */
import React, { useMemo } from 'react'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useIsFocused } from '@react-navigation/native'

/**
 * The internal imports
 */
import ExtractManagement from '@/Utils/ExtractManagement'
import { useTheme } from '@/Theme'

const ReferralWarning = () => {
  const { t } = useTranslation()
  const isFocused = useIsFocused()
  const {
    Components: { referralWarning },
  } = useTheme()

  const anyManagementReferral = useMemo(
    () => ExtractManagement().some(management => management.isReferral),
    [isFocused],
  )

  if (!anyManagementReferral) {
    return null
  }

  return (
    <View style={referralWarning.wrapper}>
      <Text style={referralWarning.textWarning}>
        {t('components.referral_warning.title')}
      </Text>
    </View>
  )
}

export default ReferralWarning
