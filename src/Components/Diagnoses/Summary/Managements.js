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
import { Management } from '@/Components'
import { useTheme } from '@/Theme'
import ExtractManagement from '@/Utils/ExtractManagement'

const Managements = () => {
  const { t } = useTranslation()
  const isFocused = useIsFocused()
  const {
    Containers: { medicines },
  } = useTheme()

  const managements = useMemo(ExtractManagement, [isFocused])

  return (
    <View style={medicines.wrapper}>
      <View style={medicines.headerWrapper}>
        <Text style={medicines.header}>
          {t('containers.medical_case.summary.managements')}
        </Text>
      </View>
      {Object.values(managements).map((management, i) => (
        <Management
          key={`summary_diagnosis_managements-${management.id}`}
          management={management}
          isLast={i === Object.values(managements).length - 1}
        />
      ))}
    </View>
  )
}

export default Managements
