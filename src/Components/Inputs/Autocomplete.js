/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View, TouchableOpacity, TextInput, Text } from 'react-native'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'
import filter from 'lodash/filter'

const Autocomplete = () => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Colors,
    FontSize,
    Gutters,
    Layout,
    Components: { autocomplete },
  } = useTheme()

  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [optionSelected, setOptionSelected] = useState(false)

  const villageList = useSelector(state => state.algorithm.item.village_json)

  /**
   * Handles the filtering and reset of the searchResults
   */
  useEffect(() => {
    if (searchTerm.length === 0 || optionSelected) {
      setSearchResults([])
    } else {
      const filteredVillageList = filter(villageList, village =>
        Object.values(village)[0].match(new RegExp(searchTerm, 'i')),
      )
      setSearchResults(filteredVillageList.slice(0, 5))
    }
  }, [searchTerm])

  /**
   * When the user selects an option, the search term is updated and the search results are cleared to close the dropdown
   * @param option
   */
  const handleOptionSelect = option => {
    setOptionSelected(true)
    setSearchTerm(option)
    // TODO save the selected option somewhere
  }

  /**
   * Updates the search term
   * @param val
   */
  const handleChangeText = val => {
    setOptionSelected(false)
    setSearchTerm(val)
  }

  return (
    <View style={[Gutters.smallTMargin, Layout.fullWidth]}>
      <View style={autocomplete.inputWrapper(searchResults.length > 0)}>
        <View style={autocomplete.inputTextWrapper}>
          <TextInput
            style={autocomplete.inputText}
            keyboardType="default"
            onChangeText={value => handleChangeText(value)}
            value={searchTerm}
            placeholder={t('application.search')}
            disabled={false}
          />
        </View>
        <View style={autocomplete.searchIcon}>
          <Icon name="search" color={Colors.grey} size={FontSize.large} />
        </View>
      </View>
      {searchResults.length > 0 && (
        <View style={autocomplete.resultsDropdown}>
          {searchResults.map(result => {
            const lastResult = Object.values(searchResults.slice(-1)[0])[0]
            const resultString = Object.values(result)[0]

            return (
              <View
                style={autocomplete.dropdownItemWrapper(
                  resultString === lastResult,
                )}
              >
                <TouchableOpacity
                  style={[Gutters.regularVPadding, Gutters.smallHPadding]}
                  onPress={() => handleOptionSelect(resultString)}
                >
                  <Text style={autocomplete.dropdownItemText}>
                    {resultString}
                  </Text>
                </TouchableOpacity>
              </View>
            )
          })}
        </View>
      )}
    </View>
  )
}

export default Autocomplete
