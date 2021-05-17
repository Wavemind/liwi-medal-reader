import React from 'react'
import { ScrollView } from 'react-native'

import { SearchBar } from '@/Components'
import { useTheme } from '@/Theme'
import { useTranslation } from 'react-i18next'

const IndexHomeContainer = props => {
  const { navigation } = props

  const { t } = useTranslation()
  const { Layout } = useTheme()

  return (
    <ScrollView style={[Layout.fill, Layout.column]}>
      <SearchBar navigation={navigation} />
    </ScrollView>
  )
}

export default IndexHomeContainer
