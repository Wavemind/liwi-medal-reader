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
import { Icon, SectionHeader, Autosuggest, BadgeBar } from '@/Components'
import { useTheme } from '@/Theme'
import DiagnosisItem from '@/Containers/Diagnosis/DiagnosisItem'
import ChangeAdditionalDiagnosis from '@/Store/MedicalCase/ChangeAdditionalDiagnosis'
import { translate } from '@/Translations/algorithm'

const ListDiagnosisContainer = ({ navigation }) => {
  // Theme and style elements deconstruction
  const {
    Colors,
    Layout,
    Fonts,
    Containers: { diagnosisList },
  } = useTheme()

  // Define store and translation hooks
  const { t } = useTranslation()
  const dispatch = useDispatch()

  // Get data from the store
  const algorithm = useSelector(state => state.algorithm.item)
  const additionalDiagnosis = useSelector(
    state => state.medicalCase.item.diagnosis.additional,
  )

  // Define component constants
  const finalDiagnosticsList = filter(algorithm.nodes, {
    type: 'FinalDiagnostic',
  })
  const numToAdd = 20

  // Local state definition
  const [diagnoses, setDiagnoses] = useState([])
  const [selected, setSelected] = useState(additionalDiagnosis)
  const [searchTerm, setSearchTerm] = useState('')
  const [numToDisplay, setNumToDisplay] = useState(numToAdd)

  /**
   * Displays the diagnoses corresponding to the searchTerm, or displays all diagnoses if the searchTerm is empty
   */
  useEffect(() => {
    if (searchTerm.length === 0) {
      displayDiagnoses()
    } else {
      const filteredDiagnosisList = filter(finalDiagnosticsList, diagnosis =>
        translate(diagnosis.label).match(new RegExp(searchTerm, 'i')),
      )
      setDiagnoses(filteredDiagnosisList)
    }
  }, [searchTerm])

  /**
   * Defines the array of diagnoses to be displayed
   */
  const displayDiagnoses = () => {
    if (searchTerm.length === 0) {
      const dataToRender = finalDiagnosticsList.slice(0, numToDisplay)
      setNumToDisplay(numToDisplay + numToAdd)
      setDiagnoses(dataToRender)
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
  const handleClose = () => {
    dispatch(
      ChangeAdditionalDiagnosis.action({
        newAdditionalDiagnosis: selected,
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
    <View style={diagnosisList.wrapper}>
      <View style={diagnosisList.headerWrapper}>
        <Text style={diagnosisList.header}>
          {t('containers.diagnosis.title')}
        </Text>
        <TouchableOpacity
          style={diagnosisList.closeButton}
          onPress={handleClose}
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
        badgeComponentLabel={itemId => translate(algorithm.nodes[itemId].label)}
      />

      <SectionHeader label="Diagnosis" />

      <FlatList
        data={diagnoses}
        style={diagnosisList.flatList}
        renderItem={({ item }) => (
          <DiagnosisItem
            selected={selected}
            item={item}
            handlePress={toggleAdditionalDiagnosis}
          />
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={renderEmptyList}
        onEndReached={() => displayDiagnoses()}
        onEndReachedThreshold={0.1}
      />
    </View>
  )
}

export default ListDiagnosisContainer
