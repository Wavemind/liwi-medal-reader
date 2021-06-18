/**
 * The external imports
 */
import React from 'react'
import { View, ScrollView } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Diagnosis, Custom } from '@/Components'

const FinalDiagnoses = () => {
  const {
    Gutters,
    Containers: { patientPersonalInfo },
  } = useTheme()

  return (
    <ScrollView style={patientPersonalInfo.wrapper}>
      <View style={Gutters.regularBMargin}>
        <Diagnosis diagnosisKey="agreed" />
        <Diagnosis diagnosisKey="additional" />
        <Custom />
      </View>
    </ScrollView>
  )
}

export default FinalDiagnoses
