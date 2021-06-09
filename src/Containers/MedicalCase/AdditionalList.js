/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import filter from 'lodash/filter'

/**
 * The internal imports
 */
import {
  Icon,
  SectionHeader,
  Autosuggest,
  BadgeBar,
  SquareButton,
} from '@/Components'
import { useTheme } from '@/Theme'
import ListItem from '@/Containers/MedicalCase/AdditionalListItem'
import { translate } from '@/Translations/algorithm'
import ChangeAdditionalDrugs from '@/Store/MedicalCase/Drugs/ChangeAdditionalDrugs'
import ChangeAdditionalDiagnoses from '@/Store/MedicalCase/ChangeAdditionalDiagnoses'

const AdditionalListContainer = ({ navigation, route }) => {
  // Theme and style elements deconstruction
  const {
    Colors,
    Layout,
    Fonts,
    Gutters,
    FontSize,
    Containers: { diagnosisList },
  } = useTheme()

  const {
    params: { diagnosisType, diagnosisId },
  } = route

  // Define store and translation hooks
  const { t } = useTranslation()
  const dispatch = useDispatch()

  // Get data from the store
  const algorithm = useSelector(state => state.algorithm.item)
  const additionalItems = useSelector(state => {
    if (diagnosisType) {
      return state.medicalCase.item.diagnosis[diagnosisType][diagnosisId].drugs
        .additional
    } else {
      return state.medicalCase.item.diagnosis.additional
    }
  })

  const itemList = diagnosisType
    ? filter(algorithm.nodes, { category: 'drug' })
    : filter(algorithm.nodes, { type: 'FinalDiagnostic' })

  const numToAdd = 20

  // Local state definition
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(additionalItems)
  const [searchTerm, setSearchTerm] = useState('')
  const [numToDisplay, setNumToDisplay] = useState(numToAdd)

  /**
   * Displays the diagnoses corresponding to the searchTerm, or displays all diagnoses if the searchTerm is empty
   */
  useEffect(() => {
    if (searchTerm.length === 0) {
      displayItems()
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
  const displayItems = () => {
    if (searchTerm.length === 0) {
      const dataToRender = itemList.slice(0, numToDisplay)
      setNumToDisplay(numToDisplay + numToAdd)
      setItems(dataToRender)
    }
  }

  /**
   * Toggles the additional diagnostic selection in the store
   * @param checkboxValue
   * @param nodeId
   */
  const toggleAdditionalItems = (checkboxValue, nodeId) => {
    const tempAdditionalItems = { ...selected }
    const index = Object.keys(tempAdditionalItems).indexOf(nodeId.toString())
    if (index > -1) {
      delete tempAdditionalItems[nodeId.toString()]
    } else {
      if (diagnosisType) {
        tempAdditionalItems[nodeId] = { id: nodeId, duration: '' }
      } else {
        tempAdditionalItems[nodeId] = {
          id: nodeId,
          drugs: {
            proposed: Object.values(algorithm.nodes[nodeId].drugs).map(
              drug => drug.id,
            ),
            agreed: {},
            refused: [],
            additional: {},
          },
        }
      }
    }
    setSelected(tempAdditionalItems)
  }

  /**
   * Updates the global store when the user is done selecting elements
   */
  const handleApply = () => {
    if (diagnosisType) {
      dispatch(
        ChangeAdditionalDrugs.action({
          diagnosisType,
          diagnosisId,
          newAdditionalDrugs: selected,
        }),
      )
    } else {
      dispatch(
        ChangeAdditionalDiagnoses.action({
          newAdditionalDiagnoses: selected,
        }),
      )
    }
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

  const itemsTitle = diagnosisType
    ? t('containers.medical_case.drugs.drugs')
    : t('containers.medical_case.diagnoses.diagnoses')

  return (
    <View style={Layout.fullHeight}>
      <View style={diagnosisList.wrapper}>
        <View style={diagnosisList.headerWrapper}>
          <Text style={diagnosisList.header}>
            {t('containers.additional_list.title', {
              items: itemsTitle,
            })}
          </Text>
          <TouchableOpacity
            style={diagnosisList.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="close" color={Colors.secondary} />
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
          badgeComponentLabel={itemId =>
            translate(algorithm.nodes[itemId].label)
          }
        />

        <SectionHeader label={itemsTitle} />

        <FlatList
          data={items}
          renderItem={({ item }) => (
            <ListItem
              selected={selected}
              item={item}
              handlePress={toggleAdditionalItems}
            />
          )}
          keyExtractor={item => item.id}
          ListEmptyComponent={renderEmptyList}
          onEndReached={() => displayItems()}
          onEndReachedThreshold={0.1}
        />
      </View>
      <View style={diagnosisList.footerWrapper}>
        {Object.keys(selected).length > 0 && (
          <TouchableOpacity
            onPress={() => setSelected([])}
            style={diagnosisList.clearFiltersButton}
          >
            <View style={diagnosisList.clearFiltersButtonWrapper}>
              <Icon
                name="refresh"
                color="red"
                size={FontSize.regular}
                style={Gutters.regularRMargin}
              />
              <Text style={diagnosisList.clearFiltersButtonText}>
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

export default AdditionalListContainer
