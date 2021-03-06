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
    Components: { drug: drugStyle },
  } = useTheme()

  /**
   * Display indication
   * @returns jsx
   */
  const indicationDisplay = () =>
    drug.diagnoses
      .map(finalDiagnose => finalDiagnose.label)
      .join(', ')
      .toUpperCase()

  return (
    <View style={drugStyle.border(isLast)}>
      <View style={drugStyle.customContainer}>
        <View style={drugStyle.drugTitleWrapper}>
          <Text style={drugStyle.buttonText}>{drug.label}</Text>
        </View>
        <View>
          <Text style={drugStyle.drugText}>
            <Text style={Fonts.textBold}>
              {t('formulations.drug.indication')}: {indicationDisplay()}
            </Text>
          </Text>

          <Text style={drugStyle.drugText}>
            <Text style={Fonts.textBold}>
              {t('formulations.drug.duration')}:
            </Text>{' '}
            {t('formulations.drug.duration_in_days', {
              count: parseFloat(drug.duration),
            })}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default CustomDrug
