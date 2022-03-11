/**
 * The external imports
 */
import React from 'react'
import { View, ScrollView, Text, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Badge, Icon } from '@/Components'

const BadgeBar = ({
  removeBadge,
  selected,
  badgeComponentLabel,
  showClearAll = false,
  onClearAll,
}) => {
  // Theme and style elements deconstruction
  const {
    FontSize,
    Gutters,
    Components: { badgeBar },
    Containers: { searchAdditional },
  } = useTheme()

  const { t } = useTranslation()

  return (
    <View style={badgeBar.container}>
      {showClearAll && selected.length > 0 && (
        <TouchableOpacity
          onPress={onClearAll}
          style={searchAdditional.clearFiltersButton}
        >
          <View style={searchAdditional.clearFiltersButtonWrapper}>
            <Icon
              name="refresh"
              color="red"
              size={FontSize.regular}
              style={Gutters.regularRMargin}
            />
            <Text style={searchAdditional.clearFiltersButtonText}>
              {t('actions.clear_selection')}
            </Text>
          </View>
        </TouchableOpacity>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {selected.map((selectedItem, i) => {
          return (
            <Badge
              key={`badge-${i}`}
              removeBadge={() => removeBadge(selectedItem)}
              selectedItem={selectedItem}
              label={() => badgeComponentLabel(selectedItem)}
            />
          )
        })}
      </ScrollView>
    </View>
  )
}

export default BadgeBar
