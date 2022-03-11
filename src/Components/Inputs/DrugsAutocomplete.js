/**
 * The external imports
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View, TouchableOpacity, TextInput, Text } from 'react-native'
import { useSelector } from 'react-redux'
import filter from 'lodash/filter'
import debounce from 'lodash/debounce'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'
import { translate } from '@/Translations/algorithm'

const Autocomplete = ({ updateAdditionalDrugs }) => {
  // Theme and style elements deconstruction
  const {
    Colors,
    FontSize,
    Gutters,
    Layout,
    Components: { autocomplete },
  } = useTheme()

  const { t } = useTranslation()

  const nodes = useSelector(state => state.algorithm.item.nodes)
  const diagnoses = useSelector(state => state.medicalCase.item.diagnosis)

  const proposedDrugs = useMemo(() => {
    const diagnosesProposedDrugs = Object.values({
      ...diagnoses.agreed,
      ...diagnoses.additional,
    })
      .map(diagnosis => diagnosis.drugs.proposed)
      .flat(1)
    return [...new Set(diagnosesProposedDrugs)]
  }, [])

  const drugList = useMemo(
    () =>
      filter(nodes, { category: 'drug' })
        .filter(item => !proposedDrugs.includes(item.id))
        .sort((a, b) => {
          return translate(a.label) > translate(b.label)
            ? 1
            : translate(b.label) > translate(a.label)
            ? -1
            : 0
        }),
    [],
  )

  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [optionSelected, setOptionSelected] = useState(true)

  // Callback that debounces the search by 500ms
  const debouncedSearch = useCallback(
    debounce(term => {
      const filteredDrugList = filter(drugList, drug =>
        translate(drug.label).match(new RegExp(term, 'i')),
      )
      setSearchResults(filteredDrugList.slice(0, 10))
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
    setSearchTerm('')
    updateAdditionalDrugs(option.id)
  }

  /**
   * Save value in store
   */
  const onEndEditing = event => {
    const newValue = event.nativeEvent.text
    console.log(newValue)
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
    const resultString = translate(result.label)

    return (
      <View
        key={`drug-${result.id}`}
        style={autocomplete.dropdownItemWrapper(
          index === searchResults.length - 1,
        )}
      >
        <TouchableOpacity
          style={[Gutters.regularVPadding, Gutters.smallHPadding]}
          onPress={() => handleOptionSelect(result)}
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
            placeholderTextColor={Colors.grey}
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
