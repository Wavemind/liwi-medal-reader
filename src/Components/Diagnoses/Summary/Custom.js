/**
 * The external imports
 */
import React from 'react'
import { Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const Custom = () => {
  // Theme and style elements deconstruction
  const {
    Gutters,
    Fonts,
    Layout,
    Containers: { finalDiagnoses, summary },
  } = useTheme()

  const { t } = useTranslation()

  const diagnoses = useSelector(
    state => state.medicalCase.item.diagnosis.custom,
  )

  return Object.values(diagnoses).map(diagnosis => {
    const drugs = Object.values(diagnosis.drugs)

    return (
      <View key={`diagnosis-${diagnosis.id}`} style={summary.wrapper}>
        <View style={summary.diagnosisHeaderWrapper}>
          <View style={Layout.row}>
            <Text style={summary.diagnosisHeader}>{diagnosis.name}</Text>
          </View>
          <Text style={summary.diagnosisKey}>
            {t('containers.medical_case.drugs.custom')}
          </Text>
        </View>
        <View style={[Gutters.regularHPadding, Gutters.regularVMargin]}>
          <View>
            <Text style={summary.drugsHeader}>
              {t('containers.medical_case.drugs.drugs')}
            </Text>
            {drugs.length === 0 ? (
              <Text style={finalDiagnoses.noItemsText}>
                {t('containers.medical_case.drugs.no_medicines')}
              </Text>
            ) : (
              drugs.map((drug, i) => (
                <View
                  key={`custom_drug-${i}`}
                  style={summary.drugWrapper(i === drugs.length - 1)}
                >
                  <Text style={summary.drugTitle}>{drug.name}</Text>
                  <Text style={Fonts.textSmall}>
                    {t('formulations.drug.duration_in_days', {
                      count: drug.duration,
                    })}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>
      </View>
    )
  })
}

export default Custom
