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
import { Badge, Icon } from '@/Components'

const BadgeBar = ({
  removeBadge,
  selected,
  clearBadges,
  badgeComponentLabel,
}) => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()

  const {
    Components: { badgeBar },
    FontSize,
    Gutters,
  } = useTheme()

  return (
    <View style={badgeBar.container}>
      {selected.length > 0 && (
        <TouchableOpacity
          onPress={() => clearBadges()}
          style={badgeBar.clearFiltersButton}
        >
          <View style={badgeBar.clearFiltersButtonWrapper}>
            <Icon
              name="refresh"
              color="red"
              size={FontSize.regular}
              style={Gutters.regularRMargin}
            />
            <Text style={badgeBar.clearFiltersButtonText}>
              {t('actions.clear_selection')}
            </Text>
          </View>
        </TouchableOpacity>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {selected.map(selectedItem => {
          return (
            <Badge
              key={`badge-${selectedItem.filterBy}-${selectedItem.value}`}
              removeBadge={removeBadge}
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
