/**
 * The external imports
 */
import React from 'react'
import { ScrollView } from 'react-native'

/**
 * The internal imports
 */
import { FinalDiagnoses, Drugs, Managements } from '@/Components'

const SummaryFinalDiagnoses = () => {
  return (
    <ScrollView>
      <FinalDiagnoses />
      <Drugs />
      <Managements />
    </ScrollView>
  )
}

export default SummaryFinalDiagnoses
