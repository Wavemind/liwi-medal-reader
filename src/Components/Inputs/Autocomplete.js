/**
 * The external imports
 */
import React, {useState, useEffect, useCallback} from 'react'
import { useTranslation } from 'react-i18next'
import { View, TouchableOpacity, TextInput, Text } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import filter from 'lodash/filter'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'
import SetAnswer from '@/Store/MedicalCase/SetAnswer'
import debounce from "lodash/debounce";
import GetAllPatientDB from "@/Store/DatabasePatient/GetAll";

const Autocomplete = ({ questionId }) => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const {
    Colors,
    FontSize,
    Gutters,
    Layout,
    Components: { autocomplete },
  } = useTheme()

  const question = useSelector(
    state => state.medicalCase.item.nodes[questionId],
  )
  const villageList = useSelector(state => state.algorithm.item.village_json)
  const [searchTerm, setSearchTerm] = useState(question.value)
  const [searchResults, setSearchResults] = useState([])
  const [optionSelected, setOptionSelected] = useState(true)

  // Callback that debounces the search by 500ms
  const debouncedSearch = useCallback(
    debounce(term => {
      const filteredVillageList = filter(villageList, village =>
        Object.values(village)[0].match(new RegExp(term, 'i')),
      )
      setSearchResults(filteredVillageList.slice(0, 5))
    }, 500),
    [],
  )

  /**
   * Handles the filtering and reset of the searchResults
   */
  useEffect(() => {
    if (searchTerm.length === 0 || optionSelected) {
      debouncedSearch.cancel()
      setSearchResults([])
    } else {
      debouncedSearch(searchTerm)
    }
  }, [searchTerm])

  /**
   * When the user selects an option, the search term is updated and the search results are cleared to close the dropdown
   * @param option
   */
  const handleOptionSelect = option => {
    setOptionSelected(true)
    setSearchTerm(option)
    dispatch(SetAnswer.action({ nodeId: question.id, value: option }))
  }

  /**
   * Save value in store
   */
  const onEndEditing = event => {
    const newValue = event.nativeEvent.text
    if (question.value !== newValue) {
      dispatch(SetAnswer.action({ nodeId: question.id, value: newValue }))
    }
  }

  /**
   * Updates the search term
   * @param text
   */
  const handleChangeText = text => {
    if (optionSelected) {
      setOptionSelected(false)
    }
    setSearchTerm(text)
  }

  /**
   * Renders each result line for searchResults
   * @param result
   * @param index
   * @returns {JSX.Element}
   */
  const renderResult = (result, index) => {
    const resultString = Object.values(result)[0]

    return (
      <View
        key={`village-${resultString}`}
        style={autocomplete.dropdownItemWrapper(
          index === searchResults.length - 1,
        )}
      >
        <TouchableOpacity
          style={[Gutters.regularVPadding, Gutters.smallHPadding]}
          onPress={() => handleOptionSelect(resultString)}
        >
          <Text style={autocomplete.dropdownItemText}>{resultString}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={[Gutters.smallTMargin, Layout.fullWidth]}>
      <View style={autocomplete.inputWrapper(searchResults.length > 0)}>
        <View style={autocomplete.inputTextWrapper}>
          <TextInput
            style={autocomplete.inputText}
            keyboardType="default"
            onChangeText={handleChangeText}
            onEndEditing={onEndEditing}
            value={searchTerm}
            placeholder={t('application.search')}
          />
        </View>
        <View style={autocomplete.searchIcon}>
          <Icon name="search" color={Colors.grey} size={FontSize.large} />
        </View>
      </View>
      {searchResults.length > 0 && (
        <View style={autocomplete.resultsDropdown}>
          {searchResults.map((result, i) => renderResult(result, i))}
        </View>
      )}
    </View>
  )
}

export default Autocomplete
