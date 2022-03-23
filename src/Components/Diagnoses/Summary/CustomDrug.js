/**
 * The external imports
 */
import React from 'react'
import { Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const CustomDrug = ({ drug, isLast }) => {
  const { t } = useTranslation()
  const {
    Fonts,
    Containers: { summary },
  } = useTheme()

  /**
   * Display indication
   * TODO: HANDLE CUSTOM DIAGNOSIS
   * @returns jsx
   */
  const indicationDisplay = () =>
    drug.relatedDiagnoses.map(finalDiagnose => finalDiagnose.name).join(', ')

  return (
    <View style={summary.drugWrapper(isLast)}>
      <View style={summary.drugTitleWrapper}>
        <Text style={summary.drugTitle}>{drug.name}</Text>
      </View>
      <View>
        <Text style={summary.drugText}>
          <Text style={Fonts.textBold}>
            {t('formulations.drug.indication')}: {indicationDisplay()}
          </Text>
        </Text>

        <Text style={summary.drugText}>
          <Text style={Fonts.textBold}>{t('formulations.drug.duration')}:</Text>{' '}
          {t('formulations.drug.duration_in_days', {
            count: parseInt(drug.duration, 10),
          })}
        </Text>
      </View>
    </View>
  )
}

export default CustomDrug
