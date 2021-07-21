/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import isEqual from 'lodash/isEqual'

/**
 * The internal imports
 */
import { Diagnosis, Custom } from '@/Components'
import { useTheme } from '@/Theme'
import { ExtractExcludedManagementsService } from '@/Services/MedicalCase'

const SummaryMedicalCaseContainer = () => {
  const { Gutters } = useTheme()
  const isFocused = useIsFocused()

  const [excludedManagements, setExcludedManagements] = useState(
    ExtractExcludedManagementsService(),
  )

  useEffect(() => {
    const managements = ExtractExcludedManagementsService()
    if (!isEqual(excludedManagements, managements)) {
      setExcludedManagements(ExtractExcludedManagementsService())
    }
  }, [isFocused])

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
