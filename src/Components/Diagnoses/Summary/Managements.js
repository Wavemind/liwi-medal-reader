/**
 * The external imports
 */
import React, { useMemo } from 'react'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { Management } from '@/Components'
import { useTheme } from '@/Theme'
import ExtractManagement from '@/Utils/ExtractManagement'

const Managements = () => {
  const { t } = useTranslation()
  const {
    Containers: { formulations },
  } = useTheme()

  const managements = useMemo(() => ExtractManagement)

  return (
    <View style={formulations.wrapper}>
      <View style={formulations.formulationsHeaderWrapper}>
        <Text style={formulations.formulationsHeader}>
          {t('containers.medical_case.summary.managements')}
        </Text>
      </View>
      {Object.values(managements).map((management, i) => (
        <Management
          key={`summary_diagnosis_managements-${management.id}`}
          management={management}
          isLast={i === Object.values(management).length - 1}
        />
      ))}
    </View>
  )
}

export default Managements
