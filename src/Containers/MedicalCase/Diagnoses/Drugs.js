/**
 * The external imports
 */
import React from 'react'
import { ScrollView } from 'react-native'

/**
 * The internal imports
 */
import { DiagnosisDrugs, CustomDrugs } from '@/Components'

const Drugs = () => {
  return (
    <ScrollView>
      <DiagnosisDrugs diagnosisKey="agreed" />
      <DiagnosisDrugs diagnosisKey="additional" />
      <CustomDrugs />
    </ScrollView>
  )
}

export default Drugs
