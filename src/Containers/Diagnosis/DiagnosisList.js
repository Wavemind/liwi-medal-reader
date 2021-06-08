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

const ListDiagnosisContainer = ({ navigation }) => {
  // Theme and style elements deconstruction
  const {
    Colors,
    Layout,
    Fonts,
    Gutters,
    FontSize,
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
    const tempAdditionalDiagnosis = { ...selected }
    const index = Object.keys(tempAdditionalDiagnosis).indexOf(
      nodeId.toString(),
    )
    if (index > -1) {
      delete tempAdditionalDiagnosis[nodeId.toString()]
    } else {
      tempAdditionalDiagnosis[nodeId] = {
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
    setSelected(tempAdditionalDiagnosis)
  }

  /**
   * Updates the global store when the user is done selecting elements
   */
  const handleApply = () => {
    dispatch(
      ChangeAdditionalDiagnoses.action({
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
          data={diagnoses}
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

export default ListDiagnosisContainer
