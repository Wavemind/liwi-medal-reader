/**
 * The external imports
 */
import React, { useEffect, useState, useMemo } from 'react'
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
import AddAgreedDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAgreedDiagnoses'
import { _keys } from '@/Utils/Object'
import sortByLabel from '@/Utils/SortByLabel'

const SearchAdditionalDiagnosesMedicalCaseContainer = ({ navigation }) => {
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
  const birthDate = useSelector(state => state.patient.item.birth_date)
  const proposed = useSelector(
    state => state.medicalCase.item.diagnosis.proposed,
  )
  const agreed = useSelector(state => state.medicalCase.item.diagnosis.agreed)
  const additional = useSelector(
    state => state.medicalCase.item.diagnosis.additional,
  )

  const days = useMemo(
    () => (birthDate ? differenceInDays(startOfToday(), birthDate) : 0),
    [birthDate],
  )

  // Filters nodes by FinalDiagnosis and then again by NeoNat questions. Then sorts by label
  const itemList = useMemo(() => {
    const filteredDiagnoses = filter(nodes, { type: 'FinalDiagnosis' }).filter(
      item => {
        const isNeoNat = nodes[item.cc].is_neonat
        return (
          !proposed.includes(item.id) &&
          ((days <= 59 && isNeoNat) || (days > 59 && !isNeoNat))
        )
      },
    )
    return sortByLabel(filteredDiagnoses)
  }, [birthDate])

  // Local state definitions
  const [numToAdd] = useState(20)
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(additional)
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
    const nodeId = item.id
    const tempAdditionalItems = { ...selected }
    const index = Object.keys(tempAdditionalItems).indexOf(nodeId.toString())
    const currentNode = nodes[nodeId]
    if (index > -1) {
      delete tempAdditionalItems[nodeId.toString()]
    } else {
      tempAdditionalItems[nodeId] = {
        id: nodeId,
        managements: Object.values(currentNode.managements).map(
          management => management.id,
        ),
        drugs: {
          proposed: Object.values(currentNode.drugs).map(drug => drug.id),
          agreed: {},
          refused: [],
          additional: {},
          custom: {},
        },
        new: true,
      }
    }
    setSelected(tempAdditionalItems)
  }

  /**
   * Updates the global store when the user is done selecting elements
   */
  const handleApply = () => {
    const newDiagnoses = Object.values(selected)
      .filter(diag => diag.new)
      .map(diag => diag.id)
    const oldAdditional = Object.values(selected)
      .filter(diag => !diag.new)
      .map(diag => diag.id)
    const oldAgreed = Object.values(agreed).map(diag => diag.id)

    const tempAgreed = JSON.parse(JSON.stringify(agreed))
    const tempAdditional = JSON.parse(JSON.stringify(selected))

    newDiagnoses.forEach(newDiagnosis => {
      delete tempAdditional[newDiagnosis].new
      selected[newDiagnosis].drugs.proposed.forEach(proposedDrug => {
        oldAdditional.forEach(oldDiagnosis => {
          const oldAgreedDrugs = selected[oldDiagnosis].drugs.agreed
          if (_keys(oldAgreedDrugs).includes(proposedDrug)) {
            delete tempAdditional[oldDiagnosis].drugs.agreed[proposedDrug]
          }
        })
        oldAgreed.forEach(oldDiagnosis => {
          const oldAgreedDrugs = agreed[oldDiagnosis].drugs.agreed
          if (_keys(oldAgreedDrugs).includes(proposedDrug)) {
            delete tempAgreed[oldDiagnosis].drugs.agreed[proposedDrug]
          }
        })
      })
    })

    Object.values(tempAgreed).forEach(diagnosis => {
      dispatch(
        AddAgreedDiagnoses.action({
          diagnosisId: diagnosis.id,
          diagnosisContent: diagnosis,
        }),
      )
    })
    dispatch(
      AddAdditionalDiagnoses.action({
        newAdditionalDiagnoses: tempAdditional,
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
            {t('containers.additional_list.title')}
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
          badgeComponentLabel={item => translate(nodes[item.id].label)}
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

export default SearchAdditionalDiagnosesMedicalCaseContainer
