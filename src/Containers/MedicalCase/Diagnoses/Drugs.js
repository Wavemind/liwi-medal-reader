/**
 * The external imports
 */
import React from 'react'
import { ScrollView, View } from 'react-native'

/**
 * The internal imports
 */
import { DiagnosisDrugs, CustomDrugs } from '@/Components'
import { useTheme } from '@/Theme'

const Drugs = () => {
  const { Gutters } = useTheme()

  return (
    <ScrollView>
      <View style={Gutters.regularBMargin}>
        <DiagnosisDrugs diagnosisKey="agreed" />
        <DiagnosisDrugs diagnosisKey="additional" />
        <CustomDrugs />
      </View>
    </ScrollView>
  )
}

export default Drugs
