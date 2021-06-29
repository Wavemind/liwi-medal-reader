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
import { Config } from '@/Config'
import { translate } from '@/Translations/algorithm'
import ClearFilters from '@/Store/Filters/ClearFilters'

const IndexFiltersContainer = ({ navigation, route }) => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Colors,
    Gutters,
    FontSize,
    Layout,
    Containers: { filters, searchAdditional },
  } = useTheme()
  const dispatch = useDispatch()
  const nodes = useSelector(state => state.algorithm.item.nodes)
  const data = []
  Object.values(nodes).forEach(node => {
    if (
      (node.category === Config.CATEGORIES.demographic ||
        node.category === Config.CATEGORIES.basicDemographic) &&
      (node.display_format === Config.DISPLAY_FORMAT.dropDownList ||
        node.display_format === Config.DISPLAY_FORMAT.radioButton)
    ) {
      const items = []

      Object.values(node.answers).map(answer => {
        items.push({
          nodeId: node.id,
          answerLabel: translate(answer.label),
          answerId: answer.id,
        })
      })

      data.push({
        nodeId: node.id,
        label: translate(node.label),
        items,
      })
    }
  })

  /**
   * Clear all filters
   */
  const clearFilters = async () => {
    await dispatch(ClearFilters.action({ list: route.params.list }))
    navigation.goBack()
  }

  return (
    <View style={filters.wrapper}>
      <View style={Gutters.regularHMargin}>
        <View style={filters.header}>
          <Text style={filters.title}>{t('containers.filters.title')}</Text>
          <TouchableOpacity
            style={filters.button}
            onPress={() => navigation.goBack()}
          >
            <Icon name="close" color={Colors.secondary} />
          </TouchableOpacity>
        </View>
        <ScrollView style={Layout.grow}>
          <SectionHeader label={t('containers.filters.patient_info')} />
          {data.map(item => (
            <Accordion key={item.label} data={item} list={route.params.list} />
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
              color="red"
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
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  )
}

export default IndexFiltersContainer
