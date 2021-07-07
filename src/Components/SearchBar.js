/**
 * The external imports
 */
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, TouchableOpacity } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'

const SearchBar = ({ navigation, filters = false }) => {
  // Theme and style elements deconstruction
  const {
    Layout,
    Colors,
    FontSize,
    Components: { searchBar },
  } = useTheme()

  const { t } = useTranslation()

  return (
    <View style={Layout.row}>
      <View style={searchBar.inputWrapper}>
        <View style={Layout.colCenter}>
          <Icon name="search" size={FontSize.large} />
        </View>
        <View style={searchBar.inputTextWrapper}>
          <Text style={searchBar.inputText}>{t('actions.search')}</Text>
        </View>
      </View>
      {filters && (
        <TouchableOpacity
          style={searchBar.filterButton}
          onPress={() => navigation.push('Filters')}
        >
          <Icon name="filters" size={FontSize.big} color={Colors.secondary} />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default SearchBar
