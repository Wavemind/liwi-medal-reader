/**
 * The external imports
 */
import React, { useMemo } from 'react'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { Drug, CustomDrug } from '@/Components'
import { useTheme } from '@/Theme'
import { TransformFormulationsService } from '@/Services/MedicalCase'

const Drugs = () => {
  const { t } = useTranslation()
  const {
    Gutters,
    Containers: { formulations },
  } = useTheme()

  const drugs = useMemo(() => TransformFormulationsService(true))

  return (
    <View style={formulations.wrapper}>
      <View style={formulations.formulationsHeaderWrapper}>
        <Text style={formulations.formulationsHeader}>
          {t('containers.medical_case.summary.treatments')}
        </Text>
      </View>
      <View style={[Gutters.regularHMargin, Gutters.regularVMargin]}>
        {Object.values(drugs).map((drug, i) =>
          drug.custom ? (
            <CustomDrug
              key={`summary_diagnosis_drugs-${drug.id}`}
              drug={drug}
              isLast={i === Object.values(drugs).length - 1}
            />
          ) : (
            <Drug
              key={`summary_diagnosis_drugs-${drug.id}`}
              drug={drug}
              isLast={i === Object.values(drugs).length - 1}
            />
          ),
        )}
      </View>
    </View>
  )
}

export default Drugs
