import React from 'react'
import { ScrollView, View } from 'react-native'

import { SearchBar, Patient, FilterBar } from '@/Components'
import { useTheme } from '@/Theme'

const ListPatientContainer = props => {
  const { navigation } = props

  const { Layout, Gutters } = useTheme()

  return (
    <View style={[Layout.fill]}>
      <SearchBar navigation={navigation} filters />

      <FilterBar />

      <View style={[Gutters.regularHMargin]}>
        <ScrollView>
          <Patient />
          <Patient />
          <Patient />
          <Patient />
          <Patient />
          <Patient />
          <Patient />
          <Patient />
        </ScrollView>
      </View>
    </View>
  )
}

export default ListPatientContainer
