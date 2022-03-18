/**
 * The external imports
 */
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { Icon, SquareButton } from '@/Components'
import { useTheme } from '@/Theme'

const SearchRelatedDiagnosesFooter = ({
  handleApply,
  showClearAll,
  setSelected,
}) => {
  // Theme and style elements deconstruction
  const {
    Colors,
    Gutters,
    FontSize,
    Containers: { searchAdditional },
  } = useTheme()

  // Define store and translation hooks
  const { t } = useTranslation()

  return (
    <View style={searchAdditional.footerWrapper}>
      {showClearAll && (
        <TouchableOpacity
          onPress={() => setSelected([])}
          style={searchAdditional.clearFiltersButton}
        >
          <View style={searchAdditional.clearFiltersButtonWrapper}>
            <Icon
              name="refresh"
              color={Colors.red}
              size={FontSize.regular}
              style={Gutters.regularRMargin}
            />
            <Text style={searchAdditional.clearFiltersButtonText}>
              {t('actions.clear_selection')}
            </Text>
          </View>
        </TouchableOpacity>
      )}
      <SquareButton
        label={t('actions.apply')}
        bgColor={Colors.primary}
        color={Colors.secondary}
        fullWidth={false}
        onPress={handleApply}
      />
    </View>
  )
}

export default SearchRelatedDiagnosesFooter
