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
  SelectionBar,
  LoaderList,
  Icon,
  SectionHeader,
  Autosuggest,
} from '@/Components'
import { useTheme } from '@/Theme'
import DiagnosisItem from '@/Containers/Diagnosis/DiagnosisItem'
import ChangeAdditionalDiagnosis from '@/Store/MedicalCase/ChangeAdditionalDiagnosis'
import { translate } from '@/Translations/algorithm'

const ListPatientContainer = ({ navigation }) => {
  // Theme and style elements deconstruction
  const {
    Colors,
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
  const [data, setData] = useState([])
  const [selected, setSelected] = useState(additionalDiagnosis)
  const [searchTerm, setSearchTerm] = useState('')
  const [numToDisplay, setNumToDisplay] = useState(numToAdd)

  useEffect(() => {
    if (searchTerm.length === 0) {
      displayDiagnoses()
    } else {
      const filteredDiagnosisList = filter(finalDiagnosticsList, diagnosis =>
        translate(diagnosis.label).includes(searchTerm),
      )
      setData(filteredDiagnosisList)
    }
  }, [searchTerm])

  /**
   * Defines the array of diagnoses to be displayed
   */
  const displayDiagnoses = () => {
    if (searchTerm.length === 0) {
      const dataToRender = finalDiagnosticsList.slice(0, numToDisplay)
      setNumToDisplay(numToDisplay + numToAdd)
      setData(dataToRender)
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
      <SelectionBar
        handleRemovePress={toggleAdditionalDiagnosis}
        selected={selected}
        setSelected={setSelected}
      />

      <SectionHeader label="Diagnosis" />

      <FlatList
        data={data}
        style={diagnosisList.flatList}
        renderItem={({ item }) => (
          <DiagnosisItem
            selected={selected}
            item={item}
            handlePress={toggleAdditionalDiagnosis}
          />
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={<LoaderList />}
        onEndReached={() => displayDiagnoses()}
        onEndReachedThreshold={0.1}
      />
    </View>
  )
}

export default ListPatientContainer
