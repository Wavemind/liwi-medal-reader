/**
 * The external imports
 */
import React from 'react'
import { ScrollView } from 'react-native'

/**
 * The internal imports
 */
import { Comment, Drugs, FinalDiagnoses, Managements } from '@/Components'

const SummaryMedicalCaseContainer = () => {
  return (
    <ScrollView>
      <FinalDiagnoses />
      <Drugs />
      <Managements />
      <Comment />
    </ScrollView>
  )
}

export default SummaryMedicalCaseContainer
