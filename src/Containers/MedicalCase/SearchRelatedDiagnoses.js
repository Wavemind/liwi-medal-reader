/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import filter from 'lodash/filter'
import differenceInDays from 'date-fns/differenceInDays'
import startOfToday from 'date-fns/startOfToday'

/**
 * The internal imports
 */
import {
  Icon,
  SectionHeader,
  Autosuggest,
  BadgeBar,
  SquareButton,
  AdditionalListItem,
} from '@/Components'
import { useTheme } from '@/Theme'
import { translate } from '@/Translations/algorithm'
import AddAdditionalDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAdditionalDiagnoses'
import AddAdditionalDrugs from '@/Store/MedicalCase/Drugs/AddAdditionalDrugs'

const SearchRelatedDiagnosesMedicalCaseContainer = ({
  navigation,
  route: {
    params: { drugId },
  },
}) => {
  // Theme and style elements deconstruction
  const {
    Colors,
    Layout,
    Fonts,
    Gutters,
    FontSize,
    Containers: { searchAdditional },
  } = useTheme()

  // Define store and translation hooks
  const { t } = useTranslation()
  const dispatch = useDispatch()

  // Get data from the store
  const nodes = useSelector(state => state.algorithm.item.nodes)
  const { agreed, additional } = useSelector(
    state => state.medicalCase.item.diagnosis,
  )

  const itemList = filter(nodes, { type: 'FinalDiagnosis' })
    .filter(item => {
      return Object.keys({ ...agreed, ...additional })
        .map(diagId => parseInt(diagId, 10))
        .includes(item.id)
    })
    .sort((a, b) => {
      return translate(a.label) > translate(b.label)
        ? 1
        : translate(b.label) > translate(a.label)
        ? -1
        : 0
    })

  // Local state definition
  const [numToAdd] = useState(20)
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [numToDisplay, setNumToDisplay] = useState(numToAdd)

  /**
   * Displays the diagnoses corresponding to the searchTerm, or displays all diagnoses if the searchTerm is empty
   */
  useEffect(() => {
    if (searchTerm.length === 0) {
      loadItems()
    } else {
      const filteredItemList = filter(itemList, item =>
        translate(item.label).match(new RegExp(searchTerm, 'i')),
      )
      setItems(filteredItemList)
    }
  }, [searchTerm])

  /**
   * Defines the array of diagnoses to be displayed
   */
  const loadItems = () => {
    if (searchTerm.length === 0) {
      const dataToRender = itemList.slice(0, numToDisplay)
      setNumToDisplay(numToDisplay + numToAdd)
      setItems(dataToRender)
    }
  }

  /**
   * Toggles the additional diagnostic selection in the store
   * @param item
   */
  const toggleAdditionalItems = item => {
    const tempAdditionalItems = [...selected]
    const index = tempAdditionalItems.indexOf(item)
    if (index > -1) {
      delete tempAdditionalItems[index]
    } else {
      tempAdditionalItems.push(item)
    }
    setSelected(tempAdditionalItems)
  }

  /**
   * Updates the global store when the user is done selecting elements
   */
  const handleApply = () => {
    dispatch(
      AddAdditionalDiagnoses.action({
        newAdditionalDiagnoses: selected,
      }),
    )
    navigation.goBack()
  }

  /**
   * Resets the search term and the number of diagnoses to display
   */
  const handleSearchReset = () => {
    setSearchTerm('')
    setNumToDisplay(numToAdd)
  }

  /**
   * Renders the empty list text
   * @returns {JSX.Element}
   */
  const renderEmptyList = () => {
    return (
      <View style={Layout.alignItemsCenter}>
        <Text style={Fonts.textMedium}>{t('application.no_results')}</Text>
      </View>
    )
  }

  return (
    <View style={Layout.fullHeight}>
      <View style={searchAdditional.wrapper}>
        <View style={searchAdditional.headerWrapper}>
          <Text style={searchAdditional.header}>
            {t('containers.additional_list.title', {
              items: t('containers.medical_case.diagnoses.diagnoses'),
            })}
          </Text>
          <TouchableOpacity
            style={searchAdditional.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="close" color={Colors.white} />
          </TouchableOpacity>
        </View>
        <Autosuggest
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleReset={handleSearchReset}
        />
        <BadgeBar
          removeBadge={toggleAdditionalItems}
          selected={selected}
          clearBadges={() => setSelected([])}
          badgeComponentLabel={item => translate(nodes[item].label)}
        />

        <SectionHeader
          label={t('containers.medical_case.diagnoses.diagnoses')}
        />

        <FlatList
          data={items}
          renderItem={({ item }) => (
            <AdditionalListItem
              selected={selected}
              item={item}
              handlePress={toggleAdditionalItems}
            />
          )}
          initialNumToRender={numToAdd}
          keyExtractor={item => item.id}
          ListEmptyComponent={renderEmptyList}
          onEndReached={loadItems}
          onEndReachedThreshold={0.1}
        />
      </View>
      <View style={searchAdditional.footerWrapper}>
        {Object.keys(selected).length > 0 && (
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
    </View>
  )
}

export default SearchRelatedDiagnosesMedicalCaseContainer
