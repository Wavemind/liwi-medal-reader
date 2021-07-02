/**
 * The external imports
 */
import React from 'react'
import { ScrollView, View, Text, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { SectionHeader, Icon, Accordion, SquareButton } from '@/Components'
import ClearFilters from '@/Store/Filters/ClearFilters'
import { GenerateFiltersObject } from '@/Utils'

const IndexFiltersContainer = ({ navigation, route }) => {
  // Theme and style elements deconstruction
  const {
    Colors,
    Gutters,
    FontSize,
    Layout,
    Containers: { filters, searchAdditional },
  } = useTheme()

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const nodes = useSelector(state => state.algorithm.item.nodes)
  const data = GenerateFiltersObject(nodes)

  /**
   * Clear all filters
   */
  const clearFilters = async () => {
    await dispatch(ClearFilters.action({ source: route.params.source }))
    navigation.goBack()
  }

  return (
    <View style={filters.wrapper}>
      <View style={Gutters.regularHMargin}>
        <View style={filters.header}>
          <Text style={filters.title}>{t('containers.filters.title')}</Text>
          <TouchableOpacity style={filters.button} onPress={navigation.goBack}>
            <Icon name="close" color={Colors.secondary} />
          </TouchableOpacity>
        </View>
        <ScrollView style={Layout.grow}>
          <SectionHeader label={t('containers.filters.patient_info')} />
          {data.map(item => (
            <Accordion
              key={item.label}
              data={item}
              source={route.params.source}
            />
          ))}
        </ScrollView>
      </View>
      <View style={filters.footerWrapper}>
        <TouchableOpacity
          onPress={clearFilters}
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
              {t('actions.clear_filters')}
            </Text>
          </View>
        </TouchableOpacity>
        <SquareButton
          label={t('actions.apply')}
          bgColor={Colors.primary}
          color={Colors.secondary}
          fullWidth={false}
          onPress={navigation.goBack}
        />
      </View>
    </View>
  )
}

export default IndexFiltersContainer
