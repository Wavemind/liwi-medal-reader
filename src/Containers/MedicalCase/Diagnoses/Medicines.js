import React from 'react'
import { ScrollView, Text } from 'react-native'

import { ProposedMedicines, CustomMedicines } from '@/Components'

const Medicines = () => {
  return (
    <ScrollView>
      <ProposedMedicines />
      {/*<CustomMedicines />*/}
    </ScrollView>
  )
}

export default Medicines
