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

const SelectionBar = ({ handleRemovePress, selected, setSelected }) => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()

  const {
    Components: { filterBar },
    FontSize,
    Gutters,
  } = useTheme()

  /**
   * Clears all filters by dispatching an empty array to the additional diagnosis store
   */
  const clearAll = () => {
    setSelected([])
  }

  return (
    <View style={filterBar.container}>
      {selected.length > 0 && (
        <TouchableOpacity
          onPress={() => clearAll()}
          style={filterBar.clearFiltersButton}
        >
          <View style={filterBar.clearFiltersButtonWrapper}>
            <Icon
              name="refresh"
              color="red"
              size={FontSize.regular}
              style={Gutters.regularRMargin}
            />
            <Text style={filterBar.clearFiltersButtonText}>
              {t('actions.clear_selection')}
            </Text>
          </View>
        </TouchableOpacity>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {selected.map(diagnosisId => {
          return (
            <SelectionBadge
              key={diagnosisId}
              handleRemovePress={handleRemovePress}
              diagnosisId={diagnosisId}
            />
          )
        })}
      </ScrollView>
    </View>
  )
}

export default SelectionBar
