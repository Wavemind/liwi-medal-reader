/**
 * The external imports
 */
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon, SelectionBadge } from '@/Components'

const FilterBar = () => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()

  const {
    Components: { filterBar },
    FontSize,
    Gutters,
  } = useTheme()

  return (
    <View style={filterBar.container}>
      <TouchableOpacity
        onPress={() => console.log('TODO RESET')}
        style={filterBar.clearFiltersButton}
      >
        <View style={filterBar.clearFiltersButtonWrapper}>
          <Icon
            name="refresh"
            color="red"
            size={FontSize.regular}
            style={{ ...Gutters.regularRMargin }}
          />
          <Text style={filterBar.clearFiltersButtonText}>
            {t('actions.clear_filters')}
          </Text>
        </View>
      </TouchableOpacity>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <SelectionBadge value="Acute diarrhea" />
        <SelectionBadge value="Long ass selecter diagnostic" />
        <SelectionBadge value="Acute diarrhea" />
        <SelectionBadge value="Acute diarrhea" />
      </ScrollView>
    </View>
  )
}

export default FilterBar
