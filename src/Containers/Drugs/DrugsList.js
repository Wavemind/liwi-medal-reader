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
import DiagnosisItem from '@/Containers/Diagnosis/DiagnosisItem'
import ChangeAdditionalDiagnoses from '@/Store/MedicalCase/ChangeAdditionalDiagnoses'
import { translate } from '@/Translations/algorithm'

const ListDrugsContainer = ({ navigation, route }) => {
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

  console.log(diagnosisType)
  console.log(diagnosisId)

  // Define store and translation hooks
  const { t } = useTranslation()
  const dispatch = useDispatch()

  // Get data from the store
  const algorithm = useSelector(state => state.algorithm.item)
  const additionalDrugs = useSelector(
    state =>
      state.medicalCase.item.diagnosis[diagnosisType][diagnosisId].drugs
        .additional,
  )

  console.log(additionalDrugs)

  // Define component constants
  const drugsList = filter(algorithm.nodes, {
    category: 'drug',
  })
  const numToAdd = 20

  // Local state definition
  const [drugs, setDrugs] = useState([])
  const [selected, setSelected] = useState(additionalDrugs)
  const [searchTerm, setSearchTerm] = useState('')
  const [numToDisplay, setNumToDisplay] = useState(numToAdd)

  /**
   * Displays the diagnoses corresponding to the searchTerm, or displays all diagnoses if the searchTerm is empty
   */
  useEffect(() => {
    if (searchTerm.length === 0) {
      displayDrugs()
    } else {
      const filteredDiagnosisList = filter(drugsList, diagnosis =>
        translate(diagnosis.label).match(new RegExp(searchTerm, 'i')),
      )
      setDrugs(filteredDiagnosisList)
    }
  }, [searchTerm])

  /**
   * Defines the array of diagnoses to be displayed
   */
  const displayDrugs = () => {
    if (searchTerm.length === 0) {
      const dataToRender = drugsList.slice(0, numToDisplay)
      setNumToDisplay(numToDisplay + numToAdd)
      setDrugs(dataToRender)
    }
  }

  /**
   * Toggles the additional diagnostic selection in the store
   * @param checkboxValue
   * @param nodeId
   */
  const toggleAdditionalDiagnosis = (checkboxValue, nodeId) => {
    const tempAdditionalDiagnosis = [...selected]
    const index = tempAdditionalDiagnosis.indexOf(nodeId)
    if (index > -1) {
      tempAdditionalDiagnosis.splice(index, 1)
    } else {
      tempAdditionalDiagnosis.push(nodeId)
    }
    setSelected(tempAdditionalDiagnosis)
  }

  /**
   * Updates the global store when the user is done selecting elements
   */
  const handleApply = () => {
    // dispatch(
    //   ChangeAdditionalDiagnoses.action({
    //     newAdditionalDiagnoses: selected,
    //   }),
    // )
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
    <View style={{ ...Layout.fullHeight }}>
      <View style={diagnosisList.wrapper}>
        <View style={diagnosisList.headerWrapper}>
          <Text style={diagnosisList.header}>
            {t('containers.diagnosis.title')}
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
          removeBadge={toggleAdditionalDiagnosis}
          selected={selected}
          clearBadges={() => setSelected([])}
          badgeComponentLabel={itemId =>
            translate(algorithm.nodes[itemId].label)
          }
        />

        <SectionHeader label="Diagnosis" />

        <FlatList
          data={drugs}
          renderItem={({ item }) => (
            <DiagnosisItem
              selected={selected}
              item={item}
              handlePress={toggleAdditionalDiagnosis}
            />
          )}
          keyExtractor={item => item.id}
          ListEmptyComponent={renderEmptyList}
          onEndReached={() => displayDrugs()}
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
          label="Apply Selection"
          bgColor={Colors.primary}
          color={Colors.secondary}
          fullWidth={false}
          onPress={handleApply}
        />
      </View>
    </View>
  )
}

export default ListDrugsContainer
