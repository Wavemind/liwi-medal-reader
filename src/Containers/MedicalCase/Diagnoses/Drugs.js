/**
 * The external imports
 */
import React from 'react'
import { ScrollView } from 'react-native'

/**
 * The internal imports
 */
import { ProposedDrugs, CustomDrugs } from '@/Components'
// TODO Rename DiagnosisDrugs
const Drugs = () => {
  return (
    <ScrollView>
      <ProposedDrugs diagnosisType="agreed" />
      <ProposedDrugs diagnosisType="additional" />
      <CustomDrugs />
    </ScrollView>
  )
}

export default Drugs
