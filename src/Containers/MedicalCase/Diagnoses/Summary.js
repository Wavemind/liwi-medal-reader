/**
 * The external imports
 */
import React, { useState } from 'react'
import { ScrollView, View } from 'react-native'

/**
 * The internal imports
 */
import { Diagnosis, Custom } from '@/Components'
import { useTheme } from '@/Theme'
import { extractExcludedManagements } from '@/Utils/MedicalCase'

const SummaryMedicalCaseContainer = () => {
  const { Gutters } = useTheme()

  const [excludedManagements] = useState(extractExcludedManagements())

  return (
    <ScrollView>
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

export default SummaryMedicalCaseContainer
