import React from 'react'
import { ScrollView, View } from 'react-native'

import { SearchBar, LoaderList, SectionHeader } from '@/Components'
import { useTheme } from '@/Theme'
import { useTranslation } from 'react-i18next'

const IndexHomeContainer = props => {
  const { navigation } = props

  const { t } = useTranslation()
  const { Layout, Gutters } = useTheme()

  return (
    <ScrollView style={[Layout.fill, Layout.column]}>
      <SearchBar navigation={navigation} />

      <View style={[Gutters.regularHMargin]}>
        <SectionHeader label={t('containers.home.title')} />
        <LoaderList />
      </View>
    </ScrollView>
  )
}

export default IndexHomeContainer
