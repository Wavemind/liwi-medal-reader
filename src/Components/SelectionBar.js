/**
 * The external imports
 */
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon, SelectionBadge } from '@/Components'
import ChangeAdditionalDiagnosis from '@/Store/MedicalCase/ChangeAdditionalDiagnosis'

const SelectionBar = ({ handleRemovePress }) => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()

  const {
    Components: { filterBar },
    FontSize,
    Gutters,
  } = useTheme()

  const additionalDiagnosis = useSelector(
    state => state.medicalCase.item.diagnosis.additional,
  )

  const dispatch = useDispatch()

  /**
   * Clears all filters by dispatching an empty array to the additional diagnosis store
   */
  const clearAll = () => {
    dispatch(
      ChangeAdditionalDiagnosis.action({
        newAdditionalDiagnosis: [],
      }),
    )
  }

  return (
    <View style={filterBar.container}>
      <TouchableOpacity
        onPress={() => clearAll()}
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
        {additionalDiagnosis.map(diagnosisId => {
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
