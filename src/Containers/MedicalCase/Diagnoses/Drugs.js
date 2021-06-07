import React from 'react'
import { ScrollView, Text } from 'react-native'

import { ProposedDrugs, CustomDrugs } from '@/Components'
import { useTheme } from '@/Theme'

const Drugs = () => {
  // Theme and style elements deconstruction
  const {
    Layout,
    Fonts,
    Colors,
    Gutters,
    Containers: { medicalCaseDrugs },
    Components: { booleanButton },
  } = useTheme()

  return (
    <ScrollView>
      <ProposedDrugs />
      <CustomDrugs />
    </ScrollView>
  )
}

export default Drugs
