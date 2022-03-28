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
import { Drug, SummaryCustomDrug } from '@/Components'
import { useTheme } from '@/Theme'
import { reworkAndOrderDrugs } from '@/Utils/Drug'

const Drugs = () => {
  const { t } = useTranslation()
  const isFocused = useIsFocused()
  const {
    Gutters,
    Containers: { medicines },
  } = useTheme()

  const drugPerCategories = useMemo(reworkAndOrderDrugs, [isFocused])
  const agreedDrugs = drugPerCategories.calculated.filter(
    drug => drug.key === 'agreed',
  )

  return (
    <View style={medicines.wrapper}>
      <View style={medicines.headerWrapper}>
        <Text style={medicines.header}>
          {t('containers.medical_case.summary.treatments')}
        </Text>
      </View>
      <View style={[Gutters.regularHMargin, Gutters.regularVMargin]}>
        {/* {agreedDrugs.map((drug, i) => (
          <Drug
            key={`summary_diagnosis_drugs-${drug.id}`}
            drug={drug}
            isLast={i === agreedDrugs.length - 1}
          />
        ))} */}
        {/* {drugPerCategories.additional.map((drug, i) => (
          <Drug
            key={`summary_diagnosis_drugs-${drug.id}`}
            drug={drug}
            isLast={i === drugPerCategories.additional.length - 1}
          />
        ))} */}
        {drugPerCategories.custom.map((drug, i) => (
          <SummaryCustomDrug
            key={`summary_diagnosis_drugs-${drug.id}`}
            drug={drug}
            isLast={i === drugPerCategories.custom.length - 1}
          />
        ))}
      </View>
    </View>
  )
}

export default Drugs
