/**
 * The external imports
 */
import React from 'react'
import { ScrollView, View } from 'react-native'

/**
 * The internal imports
 */
import { Diagnosis, Custom } from '@/Components'
import { useTheme } from '@/Theme'

const Drugs = () => {
  const { Gutters } = useTheme()

  return (
    <ScrollView>
      <View style={Gutters.regularBMargin}>
        <Diagnosis diagnosisKey="agreed" />
        <Diagnosis diagnosisKey="additional" />
        <Custom />
      </View>
    </ScrollView>
  )
}

export default Drugs
