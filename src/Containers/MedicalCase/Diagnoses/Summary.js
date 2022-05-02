/**
 * The external imports
 */
import React from 'react'
import { ScrollView } from 'react-native'

/**
 * The internal imports
 */
import {
  Comment,
  Drugs,
  FinalDiagnoses,
  Managements,
  ReferralWarning,
} from '@/Components'

const SummaryMedicalCaseContainer = () => {
  return (
    <ScrollView>
      <ReferralWarning />
      <FinalDiagnoses />
      <Drugs />
      <Managements />
      <Comment />
    </ScrollView>
  )
}

export default SummaryMedicalCaseContainer
