/**
 * The external imports
 */
import React, { useState } from 'react'
import { View, ScrollView } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Diagnosis, Custom } from '@/Components'
import { ExtractExcludedManagementsService } from '@/Services/MedicalCase'

const SummaryFinalDiagnoses = () => {
  const {
    Gutters,
    Containers: { patientPersonalInfo },
  } = useTheme()

  const [excludedManagements] = useState(ExtractExcludedManagementsService())

  return (
    <ScrollView style={patientPersonalInfo.wrapper}>
      <View style={Gutters.regularBMargin}>
        <Diagnosis
          diagnosisKey="agreed"
          excludedManagements={excludedManagements}
        />
        <Diagnosis
          diagnosisKey="additional"
          excludedManagements={excludedManagements}
        />
        <Custom />
      </View>
    </ScrollView>
  )
}

export default SummaryFinalDiagnoses
