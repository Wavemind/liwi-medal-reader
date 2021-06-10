/**
 * The external imports
 */
import React from 'react'
import { View, ScrollView } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Badge } from '@/Components'

const BadgeBar = ({ removeBadge, selected, badgeComponentLabel }) => {
  // Theme and style elements deconstruction
  const {
    Components: { badgeBar },
  } = useTheme()

  return (
    <View style={badgeBar.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {Object.values(selected).map(selectedItem => {
          return (
            <Badge
              key={`badge-${selectedItem.filterBy}-${selectedItem.value}`}
              removeBadge={removeBadge}
              selectedItem={selectedItem.id}
              label={() => badgeComponentLabel(selectedItem)}
            />
          )
        })}
      </ScrollView>
    </View>
  )
}

export default BadgeBar
