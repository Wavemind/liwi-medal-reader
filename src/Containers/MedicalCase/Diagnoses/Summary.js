/**
 * The external imports
 */
import React from 'react'
import { ScrollView, View } from 'react-native'

/**
 * The internal imports
 */
import { DiagnosisSummary, CustomDiagnosisSummary } from '@/Components'
import { useTheme } from '@/Theme'

const Drugs = () => {
  const { Gutters } = useTheme()

  return (
    <ScrollView>
      <View style={Gutters.regularBMargin}>
        <DiagnosisSummary diagnosisKey="agreed" />
        <DiagnosisSummary diagnosisKey="additional" />
        <CustomDiagnosisSummary />
      </View>
    </ScrollView>
  )
}

export default Drugs
